# ByteBox Documentation Site

Starlight-powered documentation for ByteBox.

## Local Development

```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:4321` by default.

## Build

```bash
npm run build
npm run preview
```

## Cloudflare Pages Deploy

This project includes `wrangler.toml` and deploy scripts.

```bash
npx wrangler login
npm run build
npm run cf:deploy
```

## Key Files

- `astro.config.mjs` - Starlight config, sidebar, component overrides
- `src/content/docs/` - docs content (`.md` and `.mdx`)
- `src/components/starlight/` - custom Sidebar/Footer/MobileMenuFooter overrides
- `src/components/docs/Endpoint.astro` - API callout block component
- `src/styles/bytebox-docs.css` - ByteBox-themed visual layer
- `wrangler.toml` - Cloudflare Pages config
