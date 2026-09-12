---
title: Docker and CI
description: A Makefile for the published image, environment variables, and GitHub Actions or Jenkins.
order: 6
---

The [Getting started](../getting-started/) page is the everyday command. This page covers a Makefile you can copy, environment variables, and CI.

## Makefile for your project

Drop this `Makefile` in your API repo so you can run `make run` instead of typing the Docker flags. It uses `iamuzorr/yaatt`. You still do not need to clone YAATT.

```makefile
IMAGE    = iamuzorr/yaatt
TEST_DIR = $(PWD)/tests

.PHONY: generate run dev copy_schema

copy_schema:
	YATTCID=$$(docker create $(IMAGE)); \
	docker cp $$YATTCID:/app/src/schema.json ./schema.json; \
	docker rm $$YATTCID

generate:
	docker run --rm -v $(TEST_DIR):/app/tests -t $(IMAGE) bun run generate

run:
	docker run --rm -v $(TEST_DIR):/app/tests -t $(IMAGE) bun run start $(FILE)

dev:
	docker run --rm -v $(TEST_DIR):/app/tests --env-file $(PWD)/.env -t $(IMAGE) bun run dev $(FILE)
```

| Command | What it does |
| --- | --- |
| `make copy_schema` | Copy `schema.json` onto your machine for editor help |
| `make generate` | Create a starter test in `tests/` |
| `make run` | Run every test |
| `make run FILE=catalog.yml` | Run one test file |
| `make dev` | Re-run when files change, and load `.env` |

`make dev` needs a `.env` file in the project root. Do not use it in CI. Watch mode keeps running and will not finish the job.

## Environment variables

Secrets and base URLs stay out of the test files. Use `{{env:NAME}}` in YAML, then pass the value into the container.

```sh
docker run --rm \
  --env-file .env \
  -e API_URL=https://api.example.com \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt
```

`-e` sets one variable. `--env-file` loads a file. `make run` does not load `.env`, so in scripts and CI pass `-e` or `--env-file` on `docker run`.

## Pass and fail

If every assertion passes, the command exits `0`. If any assertion fails, it exits `1`. That is what CI uses to mark the job green or red.

## GitHub Actions

This job pulls `iamuzorr/yaatt`, mounts `tests/` from the checkout, and fails the workflow when an assertion fails.

```yaml
name: API tests

on:
  push:
  pull_request:

jobs:
  yaatt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run YAATT
        env:
          API_URL: ${{ secrets.API_URL }}
        run: |
          docker run --rm \
            -e API_URL \
            -v "${{ github.workspace }}/tests:/app/tests" \
            -t iamuzorr/yaatt
```

Put `API_URL` (and any other names you use in `{{env:...}}`) in the repository secrets. `-e API_URL` forwards the job environment into the container.

To run only one file, use `iamuzorr/yaatt bun run start catalog.yml`.

GitHub-hosted runners already have Docker.

## Jenkins

A declarative `Jenkinsfile` in the repo root. The agent must be able to run Docker. Checkout is implied by the Pipeline job.

```groovy
pipeline {
  agent any

  environment {
    API_URL = credentials('yaatt-api-url')
  }

  stages {
    stage('API tests') {
      steps {
        sh '''
          docker run --rm \
            -e API_URL \
            -v "$WORKSPACE/tests:/app/tests" \
            -t iamuzorr/yaatt
        '''
      }
    }
  }
}
```

Create a Secret text credential with the id `yaatt-api-url` (Manage Jenkins → Credentials). `credentials('yaatt-api-url')` sets `API_URL` in the job; `-e API_URL` forwards it into the container.

If an assertion fails, `docker run` exits `1` and the Jenkins stage fails.

## Other CI

Any system that can run Docker can run YAATT the same way: check out the repo, start `iamuzorr/yaatt`, mount `tests/`, pass environment variables, and treat a non-zero exit as a failed job.
