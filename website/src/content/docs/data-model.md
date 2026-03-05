---
title: Data Model
description: Canonical entities, relationships, and persistence details.
---

ByteBox data is centered on four entities: `Category`, `Card`, `Tag`, and `UserSettings`.

## Entity Summary

- `Category`: board columns with `name`, `color`, and `order`.
- `Card`: content unit with type-specific fields (snippet, bookmark, image, note, etc.).
- `Tag`: reusable labels connected to cards through a many-to-many relation.
- `UserSettings`: singleton app appearance/preferences record (`id = "default"`).
  - `backgroundConfig` stores active background + saved solid color / saved gradient libraries.
  - `fontConfig` stores font families, typography sizes, and persisted sidebar/column widths.

## Card Types

Supported card type literals:

- `bookmark`
- `snippet`
- `command`
- `doc`
- `image`
- `note`

All are stored in the same `Card` table, with optional fields used based on type.

## Relationship Map

- One `Category` has many `Card`.
- One `Card` belongs to one `Category`.
- Many `Card` can have many `Tag`.
- `UserSettings` is standalone singleton data.

## Ordering Strategy

- Categories have an integer `order`.
- Cards have an integer `order` scoped by category.
- Drag/drop operations persist order through `PATCH /api/cards` bulk updates.

## Defaults and Bootstrapping

On empty databases, ByteBox auto-creates default categories in `getBoardData()`:

- Frontend
- Backend
- DevOps
- Learning & Research
- Ideas & Inspiration

## Portability Caveat

Current export/import API focuses on core fields and tags. Rich card fields like `imageData`, `fileData`, and `starred` are not included in exported payloads yet.

If you need bit-for-bit full-fidelity backup, snapshot the SQLite database file directly.

## Source of Truth

- Prisma schema: `prisma/schema.prisma`
- Query helpers: `src/lib/db/queries.ts`
- Domain types: `src/types/indev.ts`
