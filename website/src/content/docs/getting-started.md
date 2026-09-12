---
title: Getting started
description: Pull the Docker image, add a YAML test, lint it in your editor, and run it.
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

That creates a timestamped test `.yml` file. Rename it to whatever you want. See [Test files](../test-files/) for the shape.

## Lint YAML in your editor

The same `schema.json` works for YAML and JSON. VS Code and Cursor only apply it to YAML after you install an extension and point the file at the schema. Tests still run without this.

**1. Copy the schema out of the image**

```sh
YATTCID=$(docker create iamuzorr/yaatt)
docker cp $YATTCID:/app/src/schema.json ./schema.json
docker rm $YATTCID
```

**2. Install the YAML extension**

Install [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) (`redhat.vscode-yaml`) in VS Code or Cursor. Built-in JSON support does not lint `.yml` files.

**3. Point each test file at the schema**

Put this comment on the first line:

```yaml
# yaml-language-server: $schema=../schema.json
name: Product catalog
```

Your editor can then complete fields and underline mistakes while you write YAML.

JSON files can use `"$schema": "../schema.json"` in the object instead. That does not need the YAML extension.

To pass secrets, shorten the command with a Makefile, or run this on every push, see [Docker and CI](../docker-and-ci/).
