---
title: Core Concepts
description: Understand the data model and UX behavior that drive ByteBox.
---

## Data Model

ByteBox centers around four main entities:

- **Category**: board columns (e.g. Frontend, Backend, DevOps)
- **Card**: saved resource item (`bookmark`, `snippet`, `command`, `doc`, `image`, `note`)
- **Tag**: reusable labels for filtering and discovery
- **UserSettings**: singleton record for appearance/theme preferences

## Card Types

All card types share one table and differ by field usage:

- `bookmark`: `content` stores URL
- `snippet`: `content` + `language`
- `command`: command text, optional language
- `doc`: text content plus optional uploaded file fields
- `image`: `imageData` base64 payload
- `note`: free-form text

## Board Interaction

- Drag/drop uses `@dnd-kit` (both cards and category columns)
- **Card reorder / cross-column move** — `PATCH /api/cards` bulk update; the entire affected column(s) are rewritten so `order` values stay unique and contiguous
- **Column reorder** — `PATCH /api/categories` bulk update (`{ updates: [{ id, order }] }`); persisted transactionally
- **Column resize** — Board columns share a persisted width value and can be resized by dragging any column edge
- Both operations apply an optimistic state update first so the UI never snaps back while the API call is in-flight
- Card items carry their raw `id`; category columns carry `cat-{id}` inside the shared `DndContext` to avoid ID collisions
- Category rename/delete is inline on dashboard and on Categories page
- Star toggle is per-card (`PATCH /api/cards/[id]` with `action: "toggleStar"`)
- New categories always append to the end (DB assigns `MAX(order) + 1` at creation time)

## Search + View Modes

`useSearch` combines:

- text search across title/description/content/tags
- tag filtering with `AND` or `OR`
- view modes: `all`, `recent`, `starred`, `by-tag`

View mode is persisted in localStorage under `bytebox-view-mode`.

## Theme System

The theme engine uses CSS custom properties and persists to DB + localStorage:

- glass intensity
- accent palette
- icon palette + custom icon color
- background config (solid/gradient/image/default)
- background libraries (saved solid colors and saved custom gradients)
- UI and mono font choices
- UI/body/category/card/code font size controls
- sidebar and board column widths
- saved settings presets

Core implementation lives in `ThemeContext` + `themeRegistry` + `globals.css` tokens.

## Persistence Strategy

- Primary persistence: SQLite via Prisma
- Fast hydration layer: localStorage
- API-backed settings sync: debounced writes to `/api/settings`

This dual-layer approach gives fast startup feel while keeping durable server-side state.
