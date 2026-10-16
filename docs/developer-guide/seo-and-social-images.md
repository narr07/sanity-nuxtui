---
title: SEO and social images
description: Meta tags, sitemap, robots, structured data and the generated social images.
group: Developer guide
order: 310
---

# SEO and social images

SEO is handled by [Nuxt SEO](https://nuxtseo.com) (`@nuxtjs/seo`), configured in `apps/web/nuxt.config.ts`.

## Site URL and name

Set `NUXT_SITE_URL` to the production domain and, optionally, `NUXT_SITE_NAME`. The URL is used for canonical links, the sitemap, `hreflang` links and social image addresses. Outside production, indexing is blocked automatically.

## Meta tags

`app/composables/usePageSeo.ts` sets the title, description, robots and social image of a page from its SEO tab, falling back to the title, excerpt and images of the content, then to Site Settings. Pages, collections and entries call it.

## Sitemap and robots

- `/sitemap.xml` lists every page, collection and entry in every language, except those hidden from search engines. Entries come from `server/api/__sitemap__/urls.ts`, with the translations of each URL as alternatives.
- `robots.txt` is generated; fallback pages and hidden documents get `noindex`.

## Structured data

Entries output schema.org `Article` with their authors and dates (`EntryView.vue`). The site itself is an `Organization`.

## Social images

The first match wins:

1. the SEO image of the document,
2. the cover image or first photo of an entry,
3. the default image in Site Settings,
4. an image generated from the title and description.

Generated images come from [nuxt-og-image](https://nuxtseo.com/docs/og-image), rendered by Takumi from the Vue component `app/components/OgImage/Page.takumi.vue` with the theme fonts. Edit that component to change the design.

> [!IMPORTANT]
> **Set `NUXT_APP_SECRET` in production.** Image URLs are signed; without a secret, image requests fail. Generate one with `npx nuxt-og-image generate-secret`. On Cloudflare Workers, also add it as a secret of the Worker, since it is read at runtime.

The renderer is native on Vercel and Node, and WebAssembly on Cloudflare and in development. Images are cached for three days.
