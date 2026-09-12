---
title: Placeholders
description: Reuse a value from an earlier reply, from the environment, or generate a new one.
order: 4
---

In `url`, `headers`, and `body`, you can write `{{...}}` and YAATT will fill it in before sending the request. This works inside nested objects and lists. Plain numbers are left alone.

Placeholders do not work inside an assertion’s `value`. Those are used exactly as you write them.

## Earlier replies

`{{request_name.path}}` copies a field from a request that already ran. Use dots for nested fields, and `[0]` for the first item in a list.

```yaml
create_comment:
  method: post
  url: "{{env:API_URL}}/comments"
  body:
    postId: "{{create_post.id}}"
    title: "{{get_products.products[0].title}}"
```

The path must exist. If YAATT cannot find the value, the test stops with an error.

## Environment variables

`{{env:NAME}}` reads `NAME` from the environment. The name may contain letters, digits, and underscores. If the variable is missing, YAATT stops with `"NAME" not defined in environment.`

Pass variables into Docker with `-e` or a `.env` file:

```sh
docker run --rm \
  --env-file .env \
  -e API_URL=https://dummyjson.com \
  -v $(pwd)/tests:/app/tests \
  -t iamuzorr/yaatt bun run start
```

`make dev` already reads `.env`. `make run` does not; pass `-e` or `--env-file` on the `docker run` command. See [Docker and CI](../docker-and-ci/).

```yaml
get_products:
  method: get
  url: "{{env:DUMMY_API_URL}}/products/3"
```

## Generated values

`{{gen:...}}` creates a fresh value when the request is sent.

| Placeholder | Result |
| --- | --- |
| `{{gen:uuid}}` | A unique id (UUID v7) |
| `{{gen:number}}` | A random whole number from `0` to `999`, as text |

```yaml
add_product:
  method: post
  url: https://dummyjson.com/products/add
  body:
    title: "sku-{{gen:uuid}}"
    price: "{{gen:number}}"
```

Unknown generators (`{{gen:date}}`, and so on) fail the run.
