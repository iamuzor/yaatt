# YAATT Usage Guide

YAATT (Yet Another API Test Tool) runs API tests written as JSON or YAML files. Each file is a suite: it sends HTTP requests in order, then checks assertions against the cached responses.

## Prerequisites

- [Docker](https://docs.docker.com/get-started/get-docker/)
- A `tests/` directory in the project root (YAATT only loads files from there)

You can also run YAATT with [Bun](https://bun.sh) without Docker. See [Run without Docker](#run-without-docker).

## Setup

Build the image:

```sh
make build
```

Or with Docker directly:

```sh
docker build -t iamuzorr/yaatt .
```

Copy the JSON Schema onto the host if you want editor autocomplete and validation. This is optional and does not affect test execution.

```sh
make copy_schema
```

Point test files at the schema:

```json
{
  "$schema": "../schema.json"
}
```

## Add a test file

Generate a starter JSON file in `tests/`:

```sh
make generate
```

The file is named with a UTC timestamp, for example `2026_09_12T11_30_00Z_test.json`. Rename it to something meaningful.

You can also write YAML. Both formats use the same fields.

## Run tests

Run every file in `tests/`:

```sh
make run
```

Run a single file:

```sh
make run FILE=checkout.yml
```

Re-run automatically when files change:

```sh
make dev
```

Dev mode also loads environment variables from a `.env` file in the project root.

Equivalent Docker commands:

```sh
docker run --rm -v $(pwd)/tests:/app/tests -t iamuzorr/yaatt bun run start
docker run --rm -v $(pwd)/tests:/app/tests -t iamuzorr/yaatt bun run start checkout.yml
docker run --rm -v $(pwd)/tests:/app/tests --env-file $(pwd)/.env -t iamuzorr/yaatt bun run dev
```

YAATT exits `0` when every assertion passes and `1` when any assertion fails. Watch mode (`dev`) does not exit after a run.

## Test file structure

A suite has three required fields: `name`, `requests`, and `assertions`. `description` is optional.

```yaml
"$schema": "../schema.json"
name: Product catalog
description: List products and create one
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

The same suite in JSON:

```json
{
  "$schema": "../schema.json",
  "name": "Product catalog",
  "description": "List products and create one",
  "requests": {
    "get_products": {
      "method": "get",
      "url": "https://dummyjson.com/products"
    },
    "add_product": {
      "method": "post",
      "url": "https://dummyjson.com/products/add",
      "body": {
        "title": "hello_world",
        "price": "{{gen:number}}"
      }
    }
  },
  "assertions": [
    {
      "property": "get_products",
      "type": "status_code",
      "value": 200
    },
    {
      "property": "get_products.products",
      "type": "is_not_empty"
    },
    {
      "property": "get_products.products[0].tags",
      "type": "contains",
      "value": "beauty"
    }
  ]
}
```

Requests run in the order they appear as object keys. Each response is stored under that request’s key. Assertions run after every request in the file has finished.

Responses must be JSON. YAATT parses the body with `response.json()` and cannot read non-JSON responses.

## Requests

Each entry under `requests` is either an HTTP call or a delay. The object key is the request id (`get_products`, `add_product`, `wait_for_index`, and so on). Use that id in later placeholders and assertions.

### HTTP requests

| Field         | Required                                      | Notes                                                                 |
| ------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| `method`      | Yes                                           | `get`, `post`, `put`, `patch`, or `delete`                            |
| `url`         | Yes                                           | Full URL. Query strings belong in the URL.                            |
| `body`        | Required for `post`, `put`, and `patch`       | JSON object. Not allowed on `get` or `delete`.                        |
| `headers`     | No                                            | Defaults to `Content-Type: application/json` when omitted.            |
| `description` | No                                            | Documentation only.                                                   |

`GET` requests never send a body. Other methods send `JSON.stringify(body)`.

```json
{
  "login": {
    "method": "post",
    "url": "{{env:API_URL}}/auth/login",
    "headers": {
      "Content-Type": "application/json",
      "X-Request-Id": "{{gen:uuid}}"
    },
    "body": {
      "email": "{{env:TEST_USER_EMAIL}}",
      "password": "{{env:TEST_USER_PASSWORD}}"
    }
  }
}
```

### Delays

Insert a wait between requests. `delay` is the number of seconds.

```yaml
wait_for_index:
  delay: 2
```

A delay of `0` or less is skipped.

## Placeholders

String values in `url`, `headers`, and `body` can contain `{{...}}` placeholders. YAATT resolves them before sending the request. Nested objects and arrays are walked recursively. Numbers are left as-is.

### Previous responses

`{{request_id.path}}` reads a value from a request that already ran. Paths use lodash-style accessors, including array indexes.

```json
{
  "create_comment": {
    "method": "post",
    "url": "{{env:API_URL}}/comments",
    "body": {
      "postId": "{{create_post.id}}",
      "title": "{{get_products.products[0].title}}"
    }
  }
}
```

The referenced path must exist. A missing value stops the suite with an error.

### Environment variables

`{{env:NAME}}` reads `NAME` from the process environment. The name may contain letters, digits, and underscores. If the variable is missing, YAATT throws `"NAME" not defined in environment.`

Pass variables into Docker with `-e` or `--env-file`:

```sh
docker run --rm \
  --env-file .env \
  -e API_URL=https://dummyjson.com \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt bun run start
```

`make dev` already passes `--env-file $(PWD)/.env`. `make run` does not; add `-e` / `--env-file` to the Docker command, or export the variables in your shell when running with Bun.

```json
{
  "get_products": {
    "method": "get",
    "url": "{{env:DUMMY_API_URL}}/products/3"
  }
}
```

### Generated values

`{{gen:...}}` inserts a fresh value at request time.

| Placeholder     | Result                                      |
| --------------- | ------------------------------------------- |
| `{{gen:uuid}}`  | UUID v7                                     |
| `{{gen:number}}`| Random integer from `0` to `999` as a string |

```json
{
  "add_product": {
    "method": "post",
    "url": "https://dummyjson.com/products/add",
    "body": {
      "title": "sku-{{gen:uuid}}",
      "price": "{{gen:number}}"
    }
  }
}
```

Unknown generators (`{{gen:date}}`, and so on) fail the run.

## Assertions

Each assertion has a `type`, a `property`, and usually a `value`. `property` is a path into the cached responses, starting with the request id.

`status_code` is the exception: `property` should be the request id itself (for example `get_products`), not a field inside the JSON body.

| Type              | `value`        | Passes when                                                                 |
| ----------------- | -------------- | --------------------------------------------------------------------------- |
| `is_equals`       | Expected value | The property equals `value` (loose `==`)                                    |
| `is_not_empty`    | Not used       | Array or string has length, object has keys. Numbers and booleans always pass. |
| `is_greater_than` | Number         | `Number(actual) > Number(value)`                                            |
| `is_less_than`    | Number         | `Number(actual) < Number(value)`                                            |
| `contains`        | Any            | `property` is an array that includes `value` (loose `==`)                   |
| `has_property`    | Property name  | `property` is an object that has that own key                               |
| `status_code`     | HTTP status    | The request’s status matches `value`                                        |

```yaml
assertions:
  - type: status_code
    property: get_products
    value: 200
  - type: has_property
    property: get_products
    value: products
  - type: is_not_empty
    property: get_products.products
  - type: contains
    property: get_products.products[0].tags
    value: beauty
  - type: is_equals
    property: get_products.products[0].id
    value: 1
  - type: is_greater_than
    property: get_products.products[0].price
    value: 0
  - type: is_less_than
    property: add_product.price
    value: 1000
```

`contains` only works on arrays. Using it on a string or object fails.

## Output and results

A typical run prints each suite, then its requests and assertions:

```text
--------------------------------------------------------------------------------------------

TEST SUITE

Product catalog (checkout.yml)

REQUESTS

🚀 get_products		200	0.31 secs
🚀 add_product		201	0.42 secs

ASSERTIONS

✅ Pass		get_products status code is "200". (actual: 200)
✅ Pass		get_products.products is not empty. (size: 30)
❌ Fail		get_products.products[0].id is equals to "1". (actual: 3)

--------------------------------------------------------------------------------------------

*********************************************************
  RESULT:  FAILED  (1 passed, 1 failed, 0.89 seconds)
*********************************************************
```

The process exit code matches the global result: `0` for all passed, `1` for any failure.

## Run without Docker

If Bun is installed locally:

```sh
bun install
bun run start
bun run start checkout.yml
bun run dev
bun run generate
bun test
```

Environment variables come from your shell. Bun also loads a project `.env` file automatically.

## Makefile reference

| Command                 | What it does                                              |
| ----------------------- | --------------------------------------------------------- |
| `make build`            | Build the Docker image                                    |
| `make copy_schema`      | Copy `schema.json` from the image to the host             |
| `make generate`         | Create a new timestamped JSON test in `tests/`            |
| `make run`              | Run all tests                                             |
| `make run FILE=name`    | Run one test file                                         |
| `make dev`              | Watch and re-run, loading `.env`                          |
| `make test`             | Run YAATT’s own unit tests                                |
| `make publish`          | Build, unit-test, and push the image (maintainers)        |

## Limits to keep in mind

- Extra fields in a test file fail schema validation (`additionalProperties` is false).
- There is no `query` object. Put query parameters in `url`.
- There are no pre-request scripts. Use placeholders, environment variables, and request order instead.
- Placeholders are not resolved inside assertion `value` fields. Assertion values are used as written.
- HTTP responses must be JSON.
