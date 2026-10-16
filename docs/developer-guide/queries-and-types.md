---
title: Queries and types
description: How GROQ queries are organized, typed with TypeGen and used in components.
group: Developer guide
order: 305
---

# Queries and types

All GROQ lives in `frontend/app/utils/queries.ts`. Each query is wrapped in `defineQuery()`, which lets Sanity TypeGen find it and generate the type of its result.

| Query | Used by | Returns |
| --- | --- | --- |
| `ROUTE_QUERY` | `pages/[...slug].vue` | The page, collection or entry at a path |
| `LANGUAGES_QUERY` | `app.vue`, sitemap | The site language, other languages, fallback setting |
| `SETTINGS_QUERY` | `app.vue` | Header, footer, labels, in the current language |
| `SEARCH_QUERY` | `SiteSearch.vue` | Ranked search results |
| `SITEMAP_QUERY` | `server/api/__sitemap__/urls.ts` | Every public URL with its translations |

## Fragments

Queries are assembled from fragments, so a change in one place applies everywhere:

- `LINK` resolves a `link` object to a `to` path, following translations.
- `IMAGE` adds the low-quality placeholder (`lqip`) to images.
- `BLOCKS` expands page-builder blocks: links, images, and the entries of a Collection List.
- `ENTRY_CARD` is everything a card needs.
- `PATH` and `VIEW_PATH` build the URL of a document in GROQ, with the language prefix.

> [!IMPORTANT]
> **Keep fragments literal.** Every fragment ends in `as const`, and helper functions take string literals only. `useSanityQuery` finds the result type by the exact text of the query, which only survives as a TypeScript literal type. TypeGen also cannot evaluate a helper called with a variable.

## TypeGen

After changing a schema or a query, run:

```sh
npm run typegen
```

It extracts the Studio schema to `studio/schema.json` and writes `frontend/sanity.types.ts`, with a type per schema type and a `<NAME>_RESULT` type per query. `app/types/sanity.ts` derives the handy ones: `PageData`, `EntryData`, `EntryCard`, `BlockOf<'hero'>`.

## Fetching

Components fetch with `useSanityQuery` from `@nuxtjs/sanity`. It is typed by the query, reacts to parameter changes and supports live updates in the Presentation tool:

```ts [app/pages/[...slug].vue]
const { data, encodeDataAttribute } = await useSanityQuery(ROUTE_QUERY, {
  path: computed(() => parts.value.join('/') || 'home'),
  language,
  defaultLanguage: computed(() => config.value.defaultLanguage),
  // …
})
```

`encodeDataAttribute` makes blocks draggable in the Presentation tool; `PageBlocks.vue` uses it.

## Parameters

Queries that depend on the language take `$language`, `$defaultLanguage`, `$languages` and `$fallback`. See [Languages](./languages.md) for what each one does.

## Trying queries

Open **Vision** in the Studio to run GROQ against your dataset. Paste a query from `queries.ts` and set its parameters in the panel below.
