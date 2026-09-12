# Motivation

Simplicity is at the heart of this project.

Having used tools like Postman, Cucumber.js, and Cypress for testing APIs, I realized that the fundamentals I needed were extremely simple:

- Send a request to any API endpoint.
- Make assertions on the response e.g. does a property exists? does it have a certain value?

Everything else was noise. Here are a few painpoints;

- Writing tests in Postman feels cumbersome - navigating collections, environments, tabs, scripts, etc.
- Postman tests are not human-readable, and PR reviews are painful.
- Writing tests in Cucumber.js with mandatory Gherkin syntax quickly becomes exhausting. One I learnt quickly once I tried converting some legacy Postman tests to Cucumber.js.

YAATT was born out of a desire to make API testing fast, efficient, and most importantly - enjoyable.

#### Benefits

- Tests written purely in JSON, with schema support for autocomplete and linting.
- No GUI required. Write tests directly in your code editor.
- Simple assertion directives like `is_equal`, `is_not_empty`.

#### Limitations

- No pre-scripts support. Felt like an anti-pattern.
