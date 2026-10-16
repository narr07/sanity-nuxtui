---
title: Rendering and caching
description: Choose between server rendering, hybrid prerendering and a static site, and how pages are cached.
group: Developer guide
order: 311
---

# Rendering and caching

## Rendering modes

Pick one with `NUXT_RENDER_MODE` at build time:

| Mode | Build | Content changes appear | Needs a server |
| --- | --- | --- | --- |
| `ssr` (default) | `npm run build` | within `NUXT_CACHE_TTL` seconds (default 60) | yes |
| `hybrid` | `NUXT_RENDER_MODE=hybrid npm run build` | new pages right away, edits after a rebuild | yes |
| `static` | `npm run generate` | after a rebuild | no |

- **ssr** renders on demand and caches the result. The best default.
- **hybrid** prerenders every page, collection and entry at build time and serves them as static files. The server still renders pages added after the build, social images and previews.
- **static** prerenders everything into `frontend/.output/public`, including social images, the sitemap and the data for client-side navigation. Upload that folder to any static host. Visual Editing needs a separate `ssr` deployment.

The list of URLs to prerender comes from Sanity (`prerender-routes.ts`), in every language, because the crawler only finds pages something links to.

> [!TIP]
> **Rebuild on publish.** For `hybrid` and `static`, create a deploy hook on your host and add it as a webhook in sanity.io/manage → API → Webhooks, filtered to `_type in ["page", "collection", "entry", "author", "settings"]`.

## Caching

In `ssr` mode, pages are cached and refreshed in the background: visitors get a cached page instantly, and edits appear within `NUXT_CACHE_TTL` seconds of publishing.

| Platform | Mechanism |
| --- | --- |
| Vercel | ISR (`isr` route rule). The `tag` query is part of the cache key |
| Cloudflare, Node | Stale-while-revalidate (`swr` route rule) |

`/_og/**`, `/api/**`, `/_sanity/**` and `/preview/**` are never cached by these rules. Set `NUXT_CACHE_TTL=0` to turn caching off.

With a read token for Visual Editing, Vercel keeps caching and lets editors skip it; other hosts turn caching off. See [Visual Editing](./visual-editing.md).

## Page data

In `ssr` mode the page data is embedded in the HTML, so a cached page always hydrates with the data it was rendered with. In `hybrid` and `static` modes, page data is extracted to payload files for client-side navigation.
