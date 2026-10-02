# Restaurant Order Management

A DBMS coursework application built with Next.js, TypeScript and PostgreSQL. It contains customer and menu management, multi-item orders, order status updates and dashboard statistics.

[Project deployment link](https://restaurantmanagement-livid.vercel.app/) | [Schema](docs/SCHEMA.md) | [Normalization notes](docs/Normalization-Steps.md)

## Local development

Use Node.js 22 LTS, npm and a disposable PostgreSQL database. The application reads a PostgreSQL connection string from `DATABASE_URL`.

```bash
npm install
```

Create `.env.local` with a connection string for your local development database. Do not commit credentials. Initialize the schema and optional sample data with `psql`, using that same database connection:

```bash
psql "$RESTAURANT_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/schema.sql
psql "$RESTAURANT_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/seed-data.sql
npm run dev
```

Set `RESTAURANT_DATABASE_URL` in your shell to the connection string first. The schema script drops existing project tables/types, and the sample-data script truncates project data. Use a disposable database for these commands. The supplied setup helper also drops a database and role; it is not a migration tool and was not run during this audit.

Open http://localhost:3000. `npm run build` creates the application build and `npm start` serves it.

## Implementation

- `src/app/`: dashboard, customers, menu and orders pages.
- `src/app/api/`: category, customer, menu, order and statistics handlers.
- `src/lib/db.ts`: node-postgres connection pool and SQL helper.
- `database/schema.sql`: five related tables, enum types, constraints and indexes.
- `database/seed-data.sql`: example bakery data.

Order creation stores the unit price with each line item and records a cumulative total. The proposed transaction patch checks out one database client for all statements and releases it after commit or rollback, following [node-postgres transaction guidance](https://node-postgres.com/features/transactions).

## Scope

This is an academic management prototype. Authentication and role-based authorization are not implemented in the inspected API handlers. Use local sample data rather than exposing customer records through a public deployment. Production migrations, monetary-rounding policy, deployment configuration and concurrent behavior need separate validation.

The dashboard obtains statistics through API requests; it is not a streaming analytics system. No complete-feature, security-audit or production-readiness guarantee is claimed. Implementation tests were not run for this documentation and transaction patch.
