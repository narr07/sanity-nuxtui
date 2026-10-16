---
title: Visual Editing
description: Turn on the live preview in the Presentation tool, locally and in production.
group: Developer guide
order: 308
---

# Visual Editing

The Presentation tool in the Studio shows the site with drafts, lets editors click any text to edit it, and drag blocks to reorder them. It needs a read token on the site.

## Turn it on

1. Create a token with the **Viewer** role:

   ```sh
   npm run sanity -- tokens add "Preview" --role viewer
   ```

2. Add it to `frontend/.env`, with the address of the Studio:

   ```sh [frontend/.env]
   NUXT_SANITY_API_READ_TOKEN=sk...
   NUXT_SANITY_STUDIO_URL=http://localhost:3333
   ```

3. Restart the site and open **Presentation** in the Studio.

> [!WARNING]
> **The token stays on the server.** It is only used by the Nuxt server to read drafts. Never expose it with a `NUXT_PUBLIC_` variable.

## How drafts stay private

Visitors never see drafts. The Presentation tool opens `/preview/enable` with a one-time secret; the site checks the secret with Sanity and sets a preview cookie for that browser only. `/preview/disable` removes it. Drafts and stega markers are only used in a browser with that cookie.

## Production and caching

Cached pages cannot show drafts, so the cache has to be skipped for editors:

- **Vercel**: one deployment does both. Pages stay cached with ISR for visitors, and `/preview/enable` also sets Vercel's `__prerender_bypass` cookie, so the editor's browser skips the cache. The bypass token is derived from the read token; see `server/preview/enable.ts` and `isrBypassToken` in `nuxt.config.ts`.
- **Other hosts** (Cloudflare, Node): their cache cannot be skipped for a single visitor, so caching turns off when a read token is set. Use two deployments of `frontend`: the public site without a token, and a preview deployment with it.

## Point the Studio at the site

The Studio opens `SANITY_STUDIO_PREVIEW_URL`. `sanity dev` reads `studio/.env`, and `sanity deploy` also reads `studio/.env.production`, so keep `http://localhost:3000` for local work and put the deployed site in `.env.production`. The hosted Studio can still preview a local dev server: type its address in the Presentation address bar.

Add the site to the CORS origins of the project, with credentials:

```sh
npm run sanity -- cors add https://example.com --credentials
```

## Where documents appear

`studio/presentation/resolve.ts` tells the Presentation tool which URLs show a document, so an editor opening a document in Presentation lands on the right page. Update it when you add a document type with its own URL.

> [!NOTE]
> **Safari blocks cookies in cross-site frames.** Live preview from a hosted Studio (`*.sanity.studio`) to your site's domain works in Chrome, Edge and Firefox. Editors on Safari can use the Studio for writing and another browser for previewing, or you can host the Studio on the site's own domain.
