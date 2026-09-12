============================================================
🧪 API Test Runner
📂 Directory: ./tests
🕒 Started: 2025-12-07T22:32:42Z
============================================================


------------------------------------------------------------
📄 Test Suite: A sample test specification (test.yml)
------------------------------------------------------------

== Requests ==
🚀 GET  get_products   → 200 OK (312 ms)
⏳ Delay 1s
🚀 POST add_product    → 201 Created (428 ms)

== Assertions ==
✅ PASS get_products.products is not empty (length: 30)
✅ PASS get_products.products[0].tags contains "beauty")

== Suite Summary == 
Requests: 3 | Assertions: 2 | Passed: 2 | Failed: 0 | Time: 0.89s


------------------------------------------------------------
📄 Test Suite: User APIs (test_users.json)
------------------------------------------------------------

== Requests ==
🚀 GET list_users → 200 OK (221 ms)

== Assertions ==
❌ FAIL list_users.users[0].email equals "john@example.com"
   → Expected: "john@example.com"
   → Actual:   "john.doe@example.com"


============================================================
📊 Global Summary
============================================================
Suites: 2 | Passed: 1 | Failed: 1
Requests: 4 | Assertions: 3 | Failed: 1
Total time: 1.12s

=== TEST RESULT: FAILED ❌ ===
