---
title: Docker Deployment
description: Production-style ByteBox deployment with Docker Compose.
---

ByteBox includes a production-oriented Docker setup with persistent SQLite storage.

## Quick Start

```bash
docker compose up --build -d
```

Then open `http://localhost:1334`.

## What Compose Configures

- Service: `bytebox`
- Port mapping: `1334:1334`
- Persistent volume: `bytebox-data` mounted at `/data`
- `DATABASE_URL=file:/data/bytebox.db`
- Healthcheck endpoint: `GET /api/cards`

## Startup Behavior

Container entrypoint runs:

1. `prisma migrate deploy`
2. `next start -p 1334 -H 0.0.0.0`

This ensures schema is current before serving traffic.

## Useful Commands

```bash
docker compose logs -f
docker compose down
docker compose up -d
docker compose up --build -d
```

## Operational Tips

- Rebuild image after dependency or build changes.
- Back up the `bytebox-data` volume before major upgrades.
- Watch logs during first boot to confirm migration success.
