---
title: Getting Started
description: Set up ByteBox locally in minutes.
---

ByteBox is a Next.js + Prisma + SQLite application designed for fast local-first usage.

## Prerequisites

- Node.js 18+ (Node 22 recommended)
- npm 10+

## Quick Setup (Recommended)

```bash
git clone https://github.com/pinkpixel-dev/bytebox.git
cd bytebox
npm run setup
npm run dev
```

Open `http://localhost:1334`.

The setup script handles:

- `.env` creation (if missing)
- dependency install
- Prisma client generation
- migration application
- seed data population

## Manual Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

## Verify Local Health

Run these checks before contributing:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

> `next build` is configured with TypeScript build errors ignored, so always run `npx tsc --noEmit` explicitly.

## Notes

- Dev server defaults to port `1334` through `scripts/next-with-env.cjs`.
- Database defaults to `file:./dev.db` unless overridden by `DATABASE_URL`.
