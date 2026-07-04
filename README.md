# Ch2d

Barber shop appointment app. Scaffolded from the [nextjs-hasura-starter](/Users/mac/projects/nextjs-hasura-starter)
template: Next.js (App Router), Docker (Postgres + Hasura + pgAdmin), Prisma for schema/migrations,
and a thin fetch layer (`lib/api`) that talks to a GraphQL API through a server-side proxy route, plus
a plain REST fallback for anything that doesn't need Hasura.

There is no login/auth wired up on purpose — add whatever auth this app needs.

See `/Users/mac/projects/app-de-agendamento-de-barbearia` for domain reference when building out
the appointment scheduling schema/features.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Prisma → Postgres, migrations tracked in `prisma/migrations`
- Hasura GraphQL Engine in front of the same Postgres database
- `@tanstack/react-query` for client-side data fetching/caching
- Tailwind + shadcn/ui components (`components/ui`) preinstalled

## Getting started

1. `cp .env.example .env` and fill in values (defaults work for local dev as-is).
2. `docker compose up -d` — starts Postgres (5432), pgAdmin (5050), Hasura console (8080).
3. `pnpm install`
4. `pnpm db:migrate` — runs `prisma migrate dev` against the empty schema (no-op until you add models).
5. `pnpm dev` — starts the app on http://localhost:3000.

Open the Hasura console at http://localhost:8080 (admin secret from `HASURA_SECRET`), go to **Data**,
connect it to `DATABASE_URL`, and track whichever tables you want exposed on the GraphQL API.

## Adding a new project's schema

This repo intentionally ships `prisma/schema.prisma` with no models. To start building:

1. Add your models to `prisma/schema.prisma`.
2. `pnpm db:migrate --name <migration_name>` to create and apply the migration.
3. In the Hasura console, track the new tables/relationships under **Data**.
4. Add a query/mutation for it in `lib/api/fetchGraphQL.ts` (or a route + entry in `lib/api/fetchApi.ts`
   if you'd rather go through Prisma/REST instead of Hasura for that resource).
5. Wire up a hook in `lib/api/client.ts` following the `useExample` / `useCreateExample` pattern.

## Fetch strategy

Two ways to fetch data, both under `lib/api`, both aggregated by `API` in `lib/api/index.ts`:

- **GraphQL** (`lib/api/fetchGraphQL.ts`) — calls `POST /api/graphql`, which is a server route
  (`app/api/graphql/route.tsx`) that forwards the request to Hasura with the admin secret attached,
  so the secret never reaches the browser. Add operations to `OperationNames` / `GQLRequestByOperationName`.
- **REST** (`lib/api/fetchApi.ts`) — calls `app/api/<endpoint>` routes directly (see
  `app/api/example/route.ts`), for anything better served by Prisma/custom logic than by Hasura.

`API.Query.Example()` and `GET /api/example` are working smoke tests for both paths — remove them once
you have real operations.

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm db:migrate` — `prisma migrate dev`
- `pnpm db:generate` — `prisma generate`
- `pnpm db:seed` — runs `prisma/seed.ts`

## Ports

- `3000` — the app
- `5432` — Postgres
- `5050` — pgAdmin
- `8080` — Hasura console / GraphQL endpoint
