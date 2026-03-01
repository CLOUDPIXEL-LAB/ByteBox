---
title: Cloudflare Pages
description: Build and deploy ByteBox docs to Cloudflare Pages with Wrangler.
---

This docs site is static (`astro build`) and ready for Cloudflare Pages deployment.

## Included Configuration

Project includes:

- `wrangler.toml`
- Build output dir: `./dist`
- Deploy script: `npm run cf:deploy`

## First-Time Setup

1. Authenticate Wrangler:

```bash
npx wrangler login
```

2. Build docs:

```bash
npm run build
```

3. Deploy to Pages:

```bash
npm run cf:deploy
```

## Pages Project Name

The script deploys to:

- `bytebox-docs`

If you want a different Cloudflare Pages project name, update:

- `package.json` `cf:deploy` script
- `wrangler.toml` `name`

## Recommended Cloudflare Build Settings (Git-Connected Deploys)

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22`

## Optional: Local Pages Preview

After building:

```bash
npm run cf:dev
```

This serves `dist` using Wrangler’s Pages runtime emulation.
