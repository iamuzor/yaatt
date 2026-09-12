# Yet Another API Test Tool (YAATT)

YAATT lets you write API tests in YAML or JSON. Each file sends HTTP requests, then asserts on the responses. No GUI, no Gherkin, no extra DSL.

**Website:** [https://iamuzor.github.io/yaatt/](https://iamuzor.github.io/yaatt/)

For the full walkthrough — file format, assertions, placeholders, environment variables, and Makefile commands — see the [website docs](https://iamuzor.github.io/yaatt/docs/) or **[docs/USAGE.md](docs/USAGE.md)**.

## Prerequisite

- [Docker](https://docs.docker.com/get-started/get-docker/)
- A `./tests` folder in the project root

## Quick start

```sh
make build
make generate          # creates a starter file in ./tests
make run               # run every file in ./tests
make run FILE=foo.yml  # run one file
make dev               # re-run on file changes (loads .env)
```

Copy the JSON Schema onto the host if you want editor autocomplete. It is optional.

```sh
make copy_schema
```

Raw Docker equivalents and a Bun-only workflow are in the [usage guide](docs/USAGE.md).

## Test file

A suite looks like this:

```yaml
"$schema": "../schema.json"
name: A sample test specification
description: This is a sample test specification.
requests:
  get_products:
    method: get
    url: https://dummyjson.com/products
  add_product:
    method: post
    url: https://dummyjson.com/products/add
    body:
      title: hello_world
      price: "{{gen:number}}"
assertions:
  - property: get_products
    type: status_code
    value: 200
  - property: get_products.products
    type: is_not_empty
  - property: get_products.products[0].tags
    type: contains
    value: beauty
```

JSON works the same way. Put files in `./tests/`.

## Concepts

**Requests** — each key is an id (`get_products`). An HTTP request needs `method` and `url`. `post` / `put` / `patch` also need `body`. `headers` are optional. A delay is `{ delay: 2 }` (seconds).

**Assertions** — each item has `type`, `property` (a path into a cached response), and usually `value`. Supported types: `is_equals`, `is_not_empty`, `is_greater_than`, `is_less_than`, `contains`, `has_property`, `status_code`.

**Placeholders** — use these in `url`, `headers`, and `body`:

- `{{get_products.id}}` — value from a previous response
- `{{env:API_URL}}` — environment variable
- `{{gen:uuid}}` / `{{gen:number}}` — generated values

## Why YAATT

See [docs/MOTIVATION.md](docs/MOTIVATION.md).
