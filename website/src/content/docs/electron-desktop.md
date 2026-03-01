---
title: Electron Desktop
description: Running and packaging ByteBox as a native desktop app.
---

ByteBox can run as an Electron desktop app for Linux, Windows, and macOS.

## Dev Mode

```bash
npm run electron:dev
```

This script compiles Electron main/preload code, launches Next dev server, waits for `http://localhost:1334`, then opens Electron.

## Build Installers

```bash
npm run electron:build:linux
npm run electron:build:win
npm run electron:build:mac
```

## Runtime Behavior

- Development:
  Electron points to Next dev server on port `1334`.
- Packaged:
  Electron starts a bundled Next production server in-process on port `1335`.

## Migration Handling in Packaged App

On startup, `electron/main.ts`:

1. Resolves user data directory
2. Sets `DATABASE_URL` to user DB path
3. Applies pending SQL migrations from bundled `prisma/migrations`
4. Boots Next server and opens the window

## Database Location

Packaged app DB lives in OS user data path and survives upgrades.

Examples:

- Linux: `~/.config/ByteBox/bytebox.db`
- Windows: `%APPDATA%\\ByteBox\\bytebox.db`

## Notes

- Main process uses secure defaults (`contextIsolation`, `sandbox`, no node integration in renderer).
- External links open in system browser.
