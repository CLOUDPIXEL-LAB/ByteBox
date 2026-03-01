# 🔧 Electron Packaging Debug Log

> **Date:** March 1, 2026
> **Status:** 🟡 In Progress — `.prisma/client` now copies into the packaged app, but API routes still return 500. Root cause of the 500 is not yet identified.
> **Branch:** `main`

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Original Problem](#-original-problem)
- [Issues Found & Fixed](#-issues-found--fixed)
- [Current Blocker](#-current-blocker)
- [What Has Been Tried](#-what-has-been-tried)
- [Files Changed](#-files-changed)
- [Next Steps to Try](#-next-steps-to-try)
- [Key Reference Info](#-key-reference-info)

---

## 🎯 Overview

The goal is to get ByteBox's Electron installers (AppImage, `.deb`) fully working so that on a fresh install:

1. The app opens and the Next.js production server starts ✅
2. Database migrations run automatically ✅
3. Prisma client operations work (CRUD for cards, tags, categories) ❌
4. Default seed data (10 tags, 5 categories, 17 example cards) appears on first launch ❌ (blocked by #3)

---

## 🐛 Original Problem

**Symptom:** AppImage opens but the dashboard is completely empty — no default categories, no cards. Creating tags or categories fails with errors.

**Root cause investigation** uncovered **four separate issues**, three of which are now fixed.

---

## ✅ Issues Found & Fixed

### Issue 1: Missing Seed Data Logic

**Problem:** The old `ensureDefaultCategories()` function in `queries.ts` only created 5 empty category columns. It didn't create any tags or example cards, so even if Prisma worked perfectly, a fresh install would show empty columns with no content.

**Fix:** Created `src/lib/db/default-seed.ts` with a full `ensureDefaultData()` function that mirrors `prisma/seed.ts`:

- 10 tags (React, TypeScript, Docker, Git, Next.js, Tailwind, Python, API, DevOps, Tips)
- 5 categories (Bookmarks, Code Snippets, Commands, Documentation, Notes)
- 17 example cards across all categories with tag connections

Updated `queries.ts` → `getBoardData()` now calls `ensureDefaultData()` instead of the old function.

---

### Issue 2: `prisma generate` Not in Build Scripts

**Problem:** The `electron:build` scripts in `package.json` didn't run `npx prisma generate` before building. If the generated Prisma client was stale or missing, the build would silently use whatever was (or wasn't) there.

**Fix:** Prepended `npx prisma generate &&` to all four `electron:build*` scripts in `package.json`:

```
"electron:build:linux": "npx prisma generate && npm run build && npm run electron:compile && electron-builder --linux"
```

---

### Issue 3: `better-sqlite3` ABI Mismatch

**Problem:** `better-sqlite3` is a native C++ addon compiled against a specific Node.js ABI. The system Node.js (v25.4.0, ABI 141) and Electron 40.6.1's built-in Node (v24.13.1, ABI 143) use **different ABIs**. electron-builder's built-in `npmRebuild` was silently failing to recompile it for Electron's ABI, causing the AppImage to crash on launch:

```
Error: The module was compiled against a different Node.js version using
NODE_MODULE_VERSION 141. This version of Node.js requires NODE_MODULE_VERSION 143.
```

**Fix:** Created `scripts/electron-rebuild-native.cjs` — a custom `afterPack` hook that:

1. Rebuilds `better-sqlite3` in the SOURCE `node_modules/` using `node-gyp` targeting Electron's headers
2. Copies the compiled `.node` binary into the packaged output directory
3. Restores the system-Node build afterward (so `npm run dev` still works)

Set `npmRebuild: false` in `electron-builder.yml` and registered the hook via `afterPack: ./scripts/electron-rebuild-native.cjs`.

---

### Issue 4: `.prisma/client` Directory Missing from Packaged App _(Fixed mechanically, but 500s persist — see blocker)_

**Problem:** The generated Prisma client lives at `node_modules/.prisma/client/`. Because it's a **hidden directory** (starts with `.`), electron-builder's glob pattern `node_modules/**` silently skips it. The packaged app had `@prisma/` (the public package) but NOT `.prisma/` (the generated client with the WASM query compiler).

We confirmed this by:

- Adding `node_modules/.prisma/**` to the `files` list in `electron-builder.yml` — **did not work** (electron-builder still excluded it)
- Running `find` in the packaged output — only `@prisma/` was present, `.prisma/` was completely absent

**Fix:** Added step 4 to the `afterPack` hook (`scripts/electron-rebuild-native.cjs`) that uses `fs.cpSync()` to manually copy `node_modules/.prisma/client/` into the packaged app output. Build logs now confirm:

```
[afterPack] Copying .prisma/client into packaged app…
[afterPack] .prisma/client copied ✓
```

**Verified** the directory is now present in `release/linux-unpacked/resources/app/node_modules/.prisma/client/` with all required files:

- `index.js`, `index.d.ts`, `default.js`, `package.json`
- `query_compiler_fast_bg.wasm` (3.5 MB) — the WASM query compiler
- `query_compiler_fast_bg.wasm-base64.js` (4.7 MB)
- `schema.prisma`
- `runtime/` directory

---

## 🚧 Current Blocker

### All API routes return `500 Internal Server Error`

Despite `.prisma/client` now existing in the packaged app, **every API route returns a generic 500**:

```
GET  /api/cards      → 500 Internal Server Error
GET  /api/tags       → 500 Internal Server Error
GET  /api/categories → 500 Internal Server Error
```

**What makes this hard to debug:**

- Next.js production mode (`quiet: true`) swallows all error output — the server log shows nothing
- Changing `quiet: false` in the compiled `dist-electron/main.js` didn't produce error output either
- Adding `.catch()` to the request handler also didn't surface the error
- The Next.js error boundary catches it before it reaches the HTTP handler and returns a generic `Internal Server Error` plain-text response

**What we know:**

- The Prisma stack loads fine standalone in the packaged app directory:
  ```bash
  cd release/linux-unpacked/resources/app
  node -e 'require("@prisma/client")' # ✅ OK
  node -e 'require("better-sqlite3")' # ✅ OK
  node -e 'require("@prisma/adapter-better-sqlite3")' # ✅ OK
  # Full PrismaClient instantiation also succeeds ✅
  ```
- Migrations apply successfully on launch ✅
- The server starts and listens on port 1335 ✅
- The error only occurs when Next.js serves the compiled API routes

---

## 🔍 What Has Been Tried

| #   | Attempt                                                                   | Result                                                 |
| --- | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | Added `node_modules/.prisma/**` to `files` list in `electron-builder.yml` | ❌ electron-builder still excluded the hidden dir      |
| 2   | Manually copied `.prisma/client` via `afterPack` hook (`fs.cpSync`)       | ✅ Files are present, but 500s persist                 |
| 3   | Set `quiet: false` on Next.js server in compiled `main.js`                | ❌ No error output appeared                            |
| 4   | Added `.catch()` error handler to `createServer` request handler          | ❌ Error doesn't surface at this level                 |
| 5   | Tested individual `require()` calls in packaged app dir                   | ✅ All pass — Prisma, better-sqlite3, adapter all load |
| 6   | Deleted `bytebox.db` for fresh install test                               | ✅ Migrations apply, but API still 500s                |
| 7   | Checked `.next/server/app/api/cards/route.js.nft.json`                    | File traces reference `.prisma/client` correctly       |

---

## 📁 Files Changed

| File                                  | Change Type  | Description                                                                          |
| ------------------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `src/lib/db/default-seed.ts`          | **New**      | Full `ensureDefaultData()` with 10 tags, 5 categories, 17 cards                      |
| `src/lib/db/queries.ts`               | **Modified** | Replaced `ensureDefaultCategories()` with `ensureDefaultData()` import               |
| `scripts/electron-rebuild-native.cjs` | **New**      | `afterPack` hook: rebuilds better-sqlite3 for Electron ABI + copies `.prisma/client` |
| `electron-builder.yml`                | **Modified** | `npmRebuild: false`, added `afterPack` hook, added comment about `.prisma`           |
| `package.json`                        | **Modified** | Added `npx prisma generate &&` to all `electron:build*` scripts                      |

---

## 💡 Next Steps to Try

### 1. 🔎 Get the actual error message

The biggest obstacle right now is that we can't see the error. Ideas:

- **Patch the compiled API route chunk** (`src_lib_db_queries_ts_79bd998c._.js`) to add a top-level try/catch with `console.error` and `fs.writeFileSync` to a log file
- **Add `process.on('uncaughtException')` and `process.on('unhandledRejection')`** in `electron/main.ts` before starting Next.js, write errors to a file in `userData`
- **Use `NEXT_DEBUG=1`** or other Next.js debug env vars if available

### 2. 🧪 Check if it's a module resolution issue inside Next.js's compiled chunks

The compiled route chunk uses Turbopack module IDs (e.g., `e.i(24594)` for Prisma imports). It's possible the module resolver inside `.next/server/` can't find `.prisma/client` at runtime because:

- Turbopack may have resolved the path at BUILD time relative to the source project, and those paths don't exist in the packaged app
- The `.nft.json` file references like `../../../../../node_modules/.prisma/client/index.js` — these relative paths are from `.next/server/app/api/cards/` back up to the project root. If the packaged app structure differs, these would break

**Test:** Compare the directory structure depth from `.next/server/app/api/cards/` to `node_modules/.prisma/client/` in both the source project and the packaged app. They should be identical.

### 3. 🔄 Try changing Prisma's generator output path

Instead of relying on the hidden `.prisma/` directory, change the Prisma schema to output to a non-hidden directory:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}
```

Then update all imports from `@prisma/client` to `../generated/prisma`. This would bypass the hidden directory issue entirely, but is a bigger change.

### 4. 📦 Try outputting Next.js as `standalone`

Add `output: 'standalone'` to `next.config.mjs`. This makes Next.js bundle all required `node_modules` into `.next/standalone/`, which might handle the `.prisma/client` resolution internally. The Electron server would then start from `.next/standalone/server.js`.

### 5. 🐞 Check if the issue is Prisma-specific at all

The 500 might not be Prisma — it could be any import failing in the compiled route. Try hitting a minimal test route (like `/api/settings` or any route that does minimal work) to narrow it down.

---

## 📌 Key Reference Info

| Item                       | Value                                                       |
| -------------------------- | ----------------------------------------------------------- |
| Electron                   | 40.6.1                                                      |
| Electron Node.js           | v24.13.1 (ABI 143)                                          |
| System Node.js             | v25.4.0 (ABI 141)                                           |
| electron-builder           | 26.8.1                                                      |
| Prisma                     | 7.4.2                                                       |
| Next.js                    | 16.1.6                                                      |
| better-sqlite3             | (latest compatible)                                         |
| App data path              | `~/.config/bytebox/`                                        |
| Database                   | `~/.config/bytebox/bytebox.db`                              |
| Generated client           | `node_modules/.prisma/client/`                              |
| Packaged app root          | `release/linux-unpacked/resources/app/`                     |
| `.nft.json` relative paths | `../../../../../node_modules/.prisma/client/` (5 levels up) |

---

_Made with ❤️ by Pink Pixel_
