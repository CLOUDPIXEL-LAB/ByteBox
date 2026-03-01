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

- Drag/drop uses `@dnd-kit`
- Reordering persists through `PATCH /api/cards` bulk update
- Category rename/delete is inline on dashboard and on Categories page
- Star toggle is per-card (`PATCH /api/cards/[id]` with `action: "toggleStar"`)

## Search + View Modes

`useSearch` combines:

- text search across title/description/content/tags
- tag filtering with `AND` or `OR`
- view modes: `all`, `recent`, `starred`, `by-tag`

View mode is persisted in localStorage under `bytebox-view-mode`.

## Theme System

The theme engine uses CSS custom properties and persists to DB + localStorage:

- light/dark mode
- glass intensity
- accent palette
- icon palette + custom icon color
- background config (solid/gradient/image/default)
- UI and mono font choices
- saved settings presets

Core implementation lives in `ThemeContext` + `themeRegistry` + `globals.css` tokens.

## Persistence Strategy

- Primary persistence: SQLite via Prisma
- Fast hydration layer: localStorage
- API-backed settings sync: debounced writes to `/api/settings`

This dual-layer approach gives fast startup feel while keeping durable server-side state.
