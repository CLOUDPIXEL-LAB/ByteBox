---
title: Backup & Portability
description: Safe backup, restore, and migration strategies for ByteBox data.
---

ByteBox supports both API-level export/import and raw database backups. Use both for robust protection.

## Option 1: API JSON Export

Use the UI Export feature or call:

- `GET /api/export`

Restore with:

- `POST /api/import`

### Best For

- Shareable lightweight backup
- Moving core records between environments
- Human-readable snapshots

### Known Limitation

Current export payload excludes some rich fields (`imageData`, `fileData`, `starred`), so this is not a full-fidelity archive.

## Option 2: SQLite File Snapshot (Recommended for Full Fidelity)

Backup the DB file itself.

Common locations:

- Local web dev: project `dev.db`
- Docker: `/data/bytebox.db` inside the volume
- Electron packaged app: user data directory (`bytebox.db`)

This preserves all rows and columns exactly.

## Docker Backup

```bash
docker run --rm -v bytebox-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/bytebox-backup.tar.gz /data
```

Restore:

```bash
docker run --rm -v bytebox-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/bytebox-backup.tar.gz -C /
```

## Migration Safety Checklist

1. Back up DB file or volume.
2. Apply migrations (`prisma migrate deploy`).
3. Start app and hit `/api/cards`.
4. Validate representative cards (including image/doc cards).
5. Keep one rollback snapshot until verification is complete.
