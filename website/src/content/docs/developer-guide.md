---
title: Developer Guide
description: Day-to-day local development workflow, scripts, and quality checks.
---

This page is the practical workflow for extending ByteBox safely.

## Setup

```bash
npm run setup
```

This creates `.env` if needed, installs deps, generates Prisma client, applies migrations, and seeds sample data.

## Common Scripts

- `npm run dev` - start Next.js dev server on port `1334`
- `npm run build` - production build
- `npm run lint` - lint project
- `npm run db:generate` - generate Prisma client
- `npm run db:migrate` - development migration workflow
- `npm run db:seed` - seed sample data

## Quality Gate Before PR

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`next.config.ts` currently allows build with ignored TypeScript errors, so always run explicit typecheck.

## Codebase Map

- `src/app/*` - route pages and API handlers
- `src/components/*` - UI components
- `src/contexts/*` - global state contexts
- `src/hooks/*` - reusable behavior hooks
- `src/lib/*` - shared utilities and DB layer
- `prisma/*` - schema, migrations, seed

## Making API Changes

1. Update route handler under `src/app/api/*`.
2. Update DB helper in `src/lib/db/queries.ts` if needed.
3. Validate impacted docs under API and concepts sections.
4. Run lint/typecheck/build.

## Migration Discipline

- Keep migrations atomic and descriptive.
- Validate migration on clean DB and existing DB.
- Include any compatibility notes in changelog/docs.
