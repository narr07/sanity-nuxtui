---
title: Search
description: The search palette, its GROQ query and what it needs from the hosting.
group: Developer guide
order: 309
---

# Search

The search button in the header, or Ctrl/⌘ + K, opens Nuxt UI's [ContentSearch](https://ui.nuxt.com/docs/components/content-search) palette. Editors can hide it in **Site Settings → Header → Search**.

## How results are found

`SEARCH_QUERY` in `queries.ts` matches every word typed, as a prefix, against titles, excerpts, descriptions, rich text and block headings. Sanity ranks the results with `score()`, weighting title matches highest, and returns the top ten.

Results are limited to the language being viewed, plus untranslated pages when the fallback is on. Documents hidden from search engines are left out.

## Where it runs

`components/SiteSearch.vue` queries the Sanity CDN straight from the browser, with the published perspective and no token. There is no server endpoint, so search also works with a static build. This needs:

- a **public** dataset (the default), and
- the site's origin in the project's **CORS** settings.

Typing is debounced by 200 ms, and only the latest request updates the results.

## Customizing

- **Fields searched or their weight**: edit the `match` and `boost()` terms in `SEARCH_QUERY`.
- **What a result shows**: edit the projection at the end of the query and the mapping to `CommandPaletteItem` in `SiteSearch.vue`.
- **Placeholder and empty text**: they come from the Nuxt UI locale, so they are translated already.
