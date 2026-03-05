---
title: Theming & Appearance
description: ByteBox theme engine, glass system, fonts, backgrounds, and persistence.
---

ByteBox ships with a rich appearance system driven by CSS variables and persisted settings.

## What Is Configurable

- Accent palette
- Icon palette and custom icon color
- Glass intensity
- Background type and values
- Saved solid colors and saved custom gradients
- UI font and monospace font
- UI/body/category/card/code font sizes
- Sidebar width and board column width
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
- UI/body/category/card/code text sizes are configurable independently.
- Body `data-*` attributes switch active font tokens.
- Code blocks follow the active mono selection.

## Background System

Supported background types:

- default
- solid
- gradient
- image

Background helpers:

- Built-in solid color swatches
- Saveable custom solid colors (with delete)
- Saveable custom gradient presets (with delete)
- Curated built-in gradient presets

Background overlays and blend effects keep text readable across wallpapers.

## Layout Sizing

- Sidebar width is adjustable (240–460px), drag-resizable, and persisted in settings.
- Category column width is adjustable (260–560px), drag-resizable from the board, and persisted in settings.
- Width values can be captured in settings presets for quick profile switching.

## Settings API

- `GET /api/settings`
- `PATCH /api/settings`
- `PUT /api/settings`

All read/write operations target the singleton row (`id = "default"`).
