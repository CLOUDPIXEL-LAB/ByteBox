---
title: Architecture
description: How ByteBox is structured from UI to database to runtime modes.
---

ByteBox is a local-first Next.js application with optional Docker and Electron runtime targets.

## System Layout

- Frontend and API live in one Next.js App Router project.
- API routes are implemented under `src/app/api/*`.
- Persistence uses Prisma with SQLite.
- UI is componentized by domain (`cards`, `layout`, `ui`, `settings`).

## Main Layers

1. Presentation
   React components under `src/components/*` and pages under `src/app/*`.
2. State and behavior
   Hooks and contexts under `src/hooks/*` and `src/contexts/*`.
3. Data access
   DB abstraction in `src/lib/db/queries.ts`.
4. Storage
   SQLite via `better-sqlite3` and Prisma schema in `prisma/schema.prisma`.

## Runtime Targets

- Web development: `npm run dev` on `http://localhost:1334`.
- Docker: containerized Next.js server with persistent volume-backed SQLite.
- Electron: desktop shell that points to local Next dev server in dev, and in production starts a bundled Next server plus migrations.

## Request and Data Flow

1. User interaction in the dashboard triggers local state updates.
2. CRUD operations call route handlers in `src/app/api`.
3. Route handlers call DB helpers in `src/lib/db`.
4. Prisma persists entities in SQLite.
5. Updated payloads hydrate UI immediately.

## Why This Design Works

- Single codebase for web + desktop keeps behavior aligned.
- Local SQLite keeps startup and reads fast.
- Route handlers provide a stable contract for UI and future integrations.
- Prisma migrations keep schema evolution manageable across releases.

## Key Source Files

- `src/app/page.tsx`
- `src/app/api/cards/route.ts`
- `src/lib/db/queries.ts`
- `prisma/schema.prisma`
- `electron/main.ts`
- `docker-entrypoint.sh`
