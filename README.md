# Yet Another API Test Tool (YAATT)

Write API tests as YAML files. Run the Docker image. YAATT sends the requests, runs the assertions, and prints a pass or fail.

API testing should not need a GUI, Gherkin, or a cloned copy of this repo. If you can write a YAML file and you have Docker, you can run YAATT.

**Docs:** [https://yaatt.iamuzor.uk/](https://yaatt.iamuzor.uk/)

## Quick start

You need [Docker](https://docs.docker.com/get-started/get-docker/) and a `tests/` folder.

```sh
mkdir -p tests
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt
```

That pulls `iamuzorr/yaatt`, reads every file in `tests/`, and exits `0` on pass or `1` on fail.

Run one file:

```sh
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt bun run start catalog.yml
```

## Test file

Prefer YAML. Put files in `./tests/`. JSON works the same way.

```yaml
# yaml-language-server: $schema=../schema.json
name: Product catalog
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
```

For editor autocomplete on YAML, copy `schema.json` from the image, install the [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) extension, and keep the comment above. Steps are in the [docs](https://yaatt.iamuzor.uk/docs/getting-started/).

## Concepts

**Requests** — each name (`get_products`) is how later steps refer to that reply. An HTTP request needs `method` and `url`. `post` / `put` / `patch` also need `body`. A delay is `{ delay: 2 }` (seconds).

**Assertions** — each item has `type`, `property`, and usually `value`. Types: `is_equals`, `is_not_empty`, `is_greater_than`, `is_less_than`, `contains`, `has_property`, `status_code`.

**Placeholders** — in `url`, `headers`, and `body`:

- `{{get_products.id}}` — field from an earlier reply
- `{{env:API_URL}}` — environment variable
- `{{gen:uuid}}` / `{{gen:number}}` — generated values

Makefile, environment variables, and CI examples: [Docker and CI](https://yaatt.iamuzor.uk/docs/docker-and-ci/).

## Developing YAATT

This repo is the image source, not the user install path.

```sh
make build
make test
make run
```

`make run` mounts `./tests` into a locally built `iamuzorr/yaatt` image.
