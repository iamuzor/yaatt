---
title: Test files
description: What a test file looks like, which fields you need, and the order requests run.
order: 2
---

A test file needs three things: a `name`, a list of `requests`, and a list of `assertions`. `description` is optional. YAML is the usual choice; JSON works the same way.

Think of `requests` as the calls you want to make, and `assertions` as what a good reply looks like.

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

The same test in JSON:

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

YAATT sends the requests in the order they appear in the file. It remembers each reply under the name you gave it (`get_products`, `add_product`, …). After every request has finished, it runs the assertions.

Replies must be JSON. YAATT cannot read HTML or plain text responses.

Put files in `./tests/`. Extra fields that are not in the schema will fail the run.
