---
title: Running ByteBox
description: Choose the right runtime mode for development, deployment, or desktop.
---

ByteBox supports three primary runtime modes.

## 1. Web Development Mode

Use this when actively building features.

```bash
npm run dev
```

- Runs at `http://localhost:1334`
- Hot reload enabled
- Uses your local SQLite database

## 2. Docker Deployment

Use this for zero-host-dependency server deployment.

```bash
docker compose up --build -d
```

- Exposes `1334`
- Persists data in `bytebox-data` volume
- Runs migrations on container startup via `docker-entrypoint.sh`

Useful commands:

```bash
docker compose down
docker compose up -d
docker compose logs -f
```

## 3. Electron Desktop App

Use this for native installed app experience.

```bash
npm run electron:dev
```

Production packaging:

```bash
npm run electron:build:linux
npm run electron:build:win
```

Behavior highlights:

- Dev mode connects Electron to Next dev server on `1334`
- Packaged app runs a local Next server inside Electron
- Packaged app stores DB under OS user data directory
- Migrations are applied automatically in packaged startup

## Environment Variables

Core values:

- `DATABASE_URL` (default `file:./dev.db`)
- `PORT` (default `1334` in wrapper)
- `NEXT_TELEMETRY_DISABLED` (set in several runtime paths)

## Production Safety Checklist

- Run migrations before app startup (or ensure startup path does it)
- Back up SQLite file/volume
- Verify health endpoint (`/api/cards`)
- Run lint + typecheck + build in CI
