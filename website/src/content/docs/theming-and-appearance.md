---
title: Theming & Appearance
description: ByteBox theme engine, glass system, fonts, backgrounds, and persistence.
---

ByteBox ships with a rich appearance system driven by CSS variables and persisted settings.

## What Is Configurable

- Theme mode: dark/light
- Accent palette
- Icon palette and custom icon color
- Glass intensity
- Background type and values
- UI font and monospace font
- Saved settings presets

## Implementation Layers

1. Runtime state in `ThemeContext`
2. Registry defaults in `src/lib/themeRegistry.ts`
3. Token application in CSS (`src/app/globals.css`)
4. Persistence API at `/api/settings`

## Persistence Model

- Fast local hydration from `localStorage`
- Durable persistence in `user_settings` (SQLite)
- Debounced synchronization to `/api/settings`

This gives quick perceived performance while keeping settings durable across sessions.

## Glass UI Model

The app uses reusable variables and utility classes:

- `--glass-bg`
- `--glass-border`
- `--glass-shadow`
- `--glass-blur`
- `--glass-tint`

The transparency slider updates these live to shift from clear to frosted styles.

## Font System

- UI and mono fonts are configured independently.
- Body `data-*` attributes switch active font tokens.
- Code blocks follow the active mono selection.

## Background System

Supported modes:

- default
- solid
- gradient
- image

Background overlays and blend effects keep text readable across wallpapers.

## Settings API

- `GET /api/settings`
- `PATCH /api/settings`
- `PUT /api/settings`

All read/write operations target the singleton row (`id = "default"`).
