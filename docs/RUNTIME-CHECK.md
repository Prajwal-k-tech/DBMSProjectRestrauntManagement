# Local runtime check — 4 October 2026

Checked source: `d0f9886`, the merged order-transaction and dependency patch.

## Environment

- PostgreSQL 17 Alpine in a disposable Docker container, exposed only on loopback port 55437. The container used trust authentication solely for this temporary local check; this is not deployment guidance.
- Created an empty test database and ran `database/schema.sql` followed by `database/seed-data.sql` with `ON_ERROR_STOP=1`. Seed counts: 5 categories, 24 menu items, 8 customers, 8 orders and 25 order items.
- `npm run build` passed with database configuration supplied. Next.js 15.5.27 compiled, checked types and generated 12 routes.
- Served the production build on loopback port 4317. All records were fictional seed data.

## Results

| Check | Observed result |
| --- | --- |
| Categories, customers, menu, orders and statistics GET endpoints | Each returned HTTP 200 and `success: true` |
| Two-item takeaway order for customer 1 | HTTP 201, two persisted items, total 155.00 matching line subtotals |
| Order detail | HTTP 200, both items returned |
| Change status to preparing and fetch again | HTTP 200; status persisted |
| Nonexistent customer with an otherwise valid item | HTTP 500; order and item counts unchanged after rollback |
| Valid item followed by nonexistent item | HTTP 500; order and item counts unchanged |
| Negative item quantity | HTTP 400 |

## Limits

These are local smoke checks of the coursework API. They do not establish authorization, a public deployment check, concurrent price consistency, monetary precision for arbitrary values, load capacity or browser accessibility. The API currently reports missing customer/item failures as generic HTTP 500 responses. Public use with real customer data still requires authentication and authorization. The disposable test database is removed after the check.
