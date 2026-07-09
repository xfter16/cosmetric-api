# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **NestJS (Express) REST API** ("Cosmetric" — search cosmetics by INCI/ingredient) backed by **PostgreSQL**, using **pnpm** and **Prisma 7** (driver adapter `@prisma/adapter-pg`). Despite the ambitious monorepo described in `docs/spec/`, the actual code is just this one API service. Standard commands live in `package.json` scripts and `README.md`.

### Services

| Service | Required | How to run |
| --- | --- | --- |
| PostgreSQL | Yes | The startup update script does NOT start it. Start the local system cluster with `sudo pg_ctlcluster 16 main start`. Credentials expected by `.env`: user `postgres` / password `postgres`, database `app` on `localhost:5432`. |
| API (NestJS) | Yes | `pnpm start:dev` (watch mode, port 3000). Needs DB running + migrations applied first. |

Docker is not installed in this environment; `docker compose up` from the repo is not used. Run Postgres as the local apt cluster instead.

### Startup steps (after the update script has installed deps)

1. Start Postgres: `sudo pg_ctlcluster 16 main start` (idempotent; ignore "already running").
2. Ensure a `.env` exists (it is git-ignored). Copy from `.env.example`; the default `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public` matches the local cluster.
3. Apply migrations: `pnpm prisma:deploy` (or `pnpm prisma:migrate` for dev). Requires a live DB.
4. Run: `pnpm start:dev`.

### Non-obvious gotchas

- **No seed script and no committed data** — tables are empty after migration. Insert rows manually to see non-empty API output, e.g. via `psql` (`PGPASSWORD=postgres psql -h localhost -U postgres -d app`) into tables `"Brand"`, `"Product"`, `"Ingredient"`, `"ProductIngredient"` (Prisma quotes the PascalCase table/column names), or via `pnpm prisma:studio`.
- **Working, verified endpoints:** JSON API `GET /brands`, `GET /brands/:id`, `GET /products`, `GET /products/:id`, root `GET /` ("Hello World!"), and Swagger UI at `GET /docs` (supports "Try it out").
- **Known pre-existing bug — the Pug view routes `GET /view/brands` and `GET /view/brands/:id/products` return HTTP 500.** `nest-cli.json` copies `views/**/*.pug` to `dist/views`, but `src/main.ts` sets the views dir to `join(__dirname, 'views')` → `dist/src/views`, so templates aren't found. This is an app bug, not an environment issue; do not "fix" it as part of setup. The JSON API + Swagger are the working core product.
- **`pnpm test` exits with code 1** because there are no `*.spec.ts` files ("No tests found"). This is expected; use `--passWithNoTests` if you need a green exit. `pnpm test:e2e` similarly has no spec files.
- Prisma client is generated to `src/generated/prisma` by the `postinstall` hook (`prisma generate`); it is not committed, so `pnpm install` must run before build/start.
