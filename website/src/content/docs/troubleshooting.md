---
title: Troubleshooting
description: Common issues and practical recovery steps.
---

## App Does Not Start on `1334`

Check for port conflict:

```bash
lsof -i :1334
```

Kill conflicting process or set a temporary port override before start.

## Prisma Errors on Startup

Re-generate client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Confirm `DATABASE_URL` points at expected SQLite file.

## Build Passes But Types Are Broken

Run explicit typecheck:

```bash
npx tsc --noEmit
```

`next.config.ts` currently ignores TS errors during build.

## Missing Default Categories

Loading `GET /api/cards` triggers default category creation when DB is empty. Hit that endpoint and refresh UI.

## Docker Container Unhealthy

Inspect logs:

```bash
docker compose logs -f
```

Healthcheck depends on `GET /api/cards`. Failures usually mean startup migration or DB path issues.

## Electron Packaged Build Fails to Load Data

Verify:

- Migration folders are bundled (`prisma/migrations`)
- Database path in user data directory is writable
- Startup logs show migration execution

## Import/Export Mismatch

If imported data misses image or file payload fields, this is a known limitation of current JSON export schema.

Use raw SQLite backups for full fidelity.

## Search/Filter Feels Wrong

Remember filter interaction order:

1. View mode filter
2. Search query
3. Tag logic (`AND`/`OR`)

If debugging, inspect `useSearch` behavior directly.
