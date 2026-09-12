---
title: Assertions
description: The assertions you can write, and how to point them at a response.
order: 5
---

An assertion has a `type`, a `property`, and usually a `value`. `property` points at a saved reply. Start with the request name, then add the path to the field you care about.

`status_code` is different: set `property` to the request name itself (for example `get_products`), not a field inside the JSON body.

| Assertion | Value Type | Description |
| --- | --- | --- |
| `is_equals` | Any | The field matches `value`. |
| `is_not_empty` | N/A | A list or string has content, or an object has fields. Numbers and true/false always pass. |
| `is_greater_than` | Number | The field is greater than `value`. |
| `is_less_than` | Number | The field is less than `value`. |
| `contains` | Any | The field is a list that includes `value`. |
| `has_property` | String | The object has a field named `value`. |
| `status_code` | Number | The response HTTP status matvches `value`. |

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

`contains` only works on lists. Using it on a string or object fails.
