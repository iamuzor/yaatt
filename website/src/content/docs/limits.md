---
title: Limits
description: Things YAATT does not do, so you are not surprised later.
order: 7
---

- Extra fields in a test file will fail the run. Stick to the fields in the schema.
- There is no separate `query` field. Add query parameters to the `url`.
- There are no scripts that run before a request. Use placeholders, environment variables, and request order instead.
- Placeholders do not work inside an assertion’s `value`. Write those values directly.
- HTTP replies must be JSON.
