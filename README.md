# Challenge 1 — DATA PROCESSING & RENDERING (50,000+ records)

This repository contains a small full‑stack application with:

- API service: Node.js + Express + Prisma (PostgreSQL)
- Web app: Next.js (App Router) + React + Tailwind CSS
- Local development via Docker Compose (Postgres, API, Web)

## Monorepo Structure

```
./
├─ api/                    # Express API (TypeScript)
│  ├─ src/
│  │  ├─ index.ts         # API entry (starts HTTP + WebSocket)
│  │  ├─ server.ts        # Express app factory
│  │  ├─ routes/
│  │  │  ├─ dev.seed.route.ts
│  │  │  ├─ user.route.ts
│  │  │  └─ userOrder.route.ts
│  │  ├─ rt/               # Real‑time (SSE / WS)
│  │  ├─ seed/             # Database seeding
│  │  ├─ db.ts             # Prisma client
│  │  └─ types.ts          # Shared API types
│  ├─ prisma/schema.prisma # Prisma schema (User, Product, Order)
│  └─ package.json
│
├─ web/                    # Next.js 15 app (TypeScript)
│  ├─ src/
│  │  ├─ app/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ lib/
│  │     └─ api-client.ts  # API client for the web app
│  └─ package.json
│
├─ docker-compose.yml      # Postgres + API + Web
└─ README.md               # You are here
```

## Prerequisites

- Docker and Docker Compose (recommended for quickest start)
- Or, for local (non‑Docker) development:
  - Node.js 20+
  - PostgreSQL 16+

## Quick Start (Docker Compose)

This will boot Postgres, API, and Web together.

```bash
docker-compose up --build
```

- Postgres: `localhost:5432`
- API: `http://localhost:3001`
- Web: `http://localhost:3000`

The API container will automatically:
- Generate Prisma client
- Run `prisma migrate dev` with name `init`
- Start the dev server (`npm run dev`)

### Seeding Demo Data

Trigger a seed job (defaults are large to showcase performance):

```bash
curl -X POST "http://localhost:3001/dev/seed"
```

Options (override via query params):
- `users` (default from `DEFAULT_USERS`, fallback 50000)
- `orders` (default from `DEFAULT_ORDERS`, fallback 500000)
- `products` (default from `DEFAULT_PRODUCTS`, fallback 10000)

Example with smaller dataset:

```bash
curl -X POST "http://localhost:3001/dev/seed?users=500&orders=2000&products=200"
```

## Environment Variables

Create an `.env` file in `api/` (and optionally in `web/`) as needed.

API (`api/.env`):
- Copy `.env.example` to `.env`


Web (`web/.env`):
- Copy `.env.example` to `.env`

## Run Locally Without Docker

1) Install dependencies

```bash
# In api/
npm install

# In web/
npm install
```

2) Start PostgreSQL and set `api/.env` with `DATABASE_URL`

3) Generate Prisma client and run migrations

```bash
# In api/
npx prisma generate
npx prisma migrate dev --name init
```

4) Start dev servers

```bash
# In api/
npm run dev   # starts API on :3001

# In web/
npm run dev   # starts Next.js on :3000
```

## API Overview

Base URL: `http://localhost:3001`

- GET `/health`
  - Health check. Returns `{ ok: true }` when healthy.

- GET `/api/users`
  - Query params:
    - `page` (number, default 1)
    - `pageSize` (number, default 50, max 200)
    - `search` (string, optional)
    - `sortBy` (`name` | `email` | `createdAt` | `orderTotal`)
    - `sortDir` (`asc` | `desc`)
  - Returns a paginated list of users with aggregated order counts and totals.

  Example:
  ```bash
  curl "http://localhost:3001/api/users?page=1&pageSize=20&search=john&sortBy=orderTotal&sortDir=desc"
  ```

- GET `/api/users/:id/orders`
  - Query params:
    - `page` (number, default 1)
    - `pageSize` (number, default 50, max 200)
  - Returns orders for a specific user, with product name and price.

  Example:
  ```bash
  curl "http://localhost:3001/api/users/1/orders?page=1&pageSize=10"
  ```

- POST `/dev/seed`
  - Optional query params: `users`, `orders`, `products` (see Seeding Demo Data above)
  - Seeds the database and broadcasts progress over SSE/WS.

### Real‑Time Endpoints

- SSE: `GET /rt/sse`
- WebSocket: `ws://localhost:3001/rt/ws`

These broadcast progress events during seeding and can be extended for other real‑time features.

## Web App

- Next.js 15 + React 19 + Tailwind CSS 4
- Dev scripts (`web/package.json`):
  - `npm run dev` — Start dev server
  - `npm run build` — Build with Turbopack
  - `npm run start` — Start production server

By default, the web app assumes the API is reachable at `http://localhost:3001` in development.

## Useful Scripts

API (`api/package.json`):
- `npm run dev` — Start API in dev mode: `tsx src/index.ts`
- `npm run build` — TypeScript build
- `npm run start` — Run built app
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:migrate` — Run `prisma migrate dev --name init`

Web (`web/package.json`):
- `npm run dev` — Start Next.js dev server
- `npm run build` — Build with Turbopack
- `npm run start` — Start production server

## Troubleshooting

- If the API cannot connect to Postgres, verify `DATABASE_URL` and that the DB is running.
- If migrations fail on first boot, remove the `postgres_data` Docker volume and re‑create:
  ```bash
  docker-compose down -v
  docker-compose up --build
  ```
- CORS issues: set `CORS_ORIGIN` (API) to match the web app origin, e.g. `http://localhost:3000`.
- Large seed sizes can take time; start with smaller values during development.

## License

This project is provided as part of a coding challenge. All rights reserved.
