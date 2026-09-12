---
title: Getting started
description: Pull the Docker image, add a YAML test, and run it.
order: 1
---

You need [Docker](https://docs.docker.com/get-started/get-docker/) and a `tests/` folder in your project. You do not need to clone YAATT or install Bun.

## Run a test

```sh
mkdir -p tests
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt
```

That command pulls `iamuzorr/yaatt` if you do not have it yet, reads every file in `tests/`, and prints a pass or fail.

| Piece | Why it is there |
| --- | --- |
| `--rm` | Remove the container when the run finishes. |
| `-v $(pwd)/tests:/app/tests` | Give YAATT your test files. YAATT only reads that path. |
| `-t` | Allocate a terminal so the output prints cleanly. |
| `iamuzorr/yaatt` | The published image. |

Run one file:

```sh
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt bun run start catalog.yml
```

If every assertion passes, the command succeeds. If any assertion fails, the command fails.

## Add a test file

Prefer YAML. Write a `.yml` file in `tests/`, or ask the image for a starter:

```sh
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt bun run generate
```

That creates a timestamped JSON file. Rename it, or copy the same fields into a `.yml` file. Both formats use the same fields. See [Test files](../test-files/) for the shape.

## Editor help

Optional: copy the schema out of the image so your editor can complete fields and flag mistakes. Tests still run without it.

```sh
YATTCID=$(docker create iamuzorr/yaatt)
docker cp $YATTCID:/app/src/schema.json ./schema.json
docker rm $YATTCID
```

Point a test file at the schema:

```yaml
"$schema": "../schema.json"
```

## Watch mode

Re-run when files change. This is for your machine, not CI.

```sh
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  --env-file .env \
  -t iamuzorr/yaatt bun run dev
```

Watch mode needs a `.env` file. Create an empty one if you have no variables yet. It keeps running, so do not use it in CI.

To pass secrets, shorten the command with a Makefile, or run this on every push, see [Docker and CI](../docker-and-ci/).
