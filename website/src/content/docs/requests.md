---
title: Requests
description: How to send GET, POST, and other calls, plus pauses between them.
order: 3
---

Each item under `requests` is either an HTTP call or a pause. The name you give it (`get_products`, `add_product`, `wait_for_index`, …) is how later steps refer to it.

## HTTP requests

| Field | Required | Notes |
| --- | --- | --- |
| `method` | Yes | `get`, `post`, `put`, `patch`, or `delete` |
| `url` | Yes | Full URL. Put query strings in the URL itself. |
| `body` | Required for `post`, `put`, and `patch` | A JSON object. Not allowed on `get` or `delete`. |
| `headers` | No | If you omit them, YAATT sends `Content-Type: application/json`. |
| `description` | No | A note for humans. YAATT displays this when it runs your test. |

`GET` requests never send a body. Other methods send the `body` as JSON.

```yaml
login:
  method: post
  url: "{{env:API_URL}}/auth/login"
  headers:
    Content-Type: application/json
    X-Request-Id: "{{gen:uuid}}"
  body:
    email: "{{env:TEST_USER_EMAIL}}"
    password: "{{env:TEST_USER_PASSWORD}}"
```

## Delays

Wait between requests. `delay` is the number of seconds.

```yaml
wait_for_index:
  delay: 2
```

A delay of `0` or less is skipped.
