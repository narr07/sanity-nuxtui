---
title: Content model
description: The document types, how URLs map to them, and why entries are generic.
group: Developer guide
order: 303
---

# Content model

| Type | Studio menu | URL | Rendered by |
| --- | --- | --- | --- |
| `page` | Pages | `/<slug>` | `PageBlocks.vue` |
| `collection` | Collections | `/<collection>` | `CollectionView.vue` → `EntryList.vue` |
| `entry` | Collections → *name* | `/<collection>/<entry>` | `EntryView.vue` |
| `author` | Authors | — | shown on entries |
| `settings` | Site Settings | every page | `app.vue` |

The page with the slug `home` is the homepage. Nested page slugs (`company/team`) work. A page and a collection cannot share a slug in the same language; the Studio validates it. When a page and an entry share a path, the page wins.

## Pages

A `page` has a title, a slug, a `blocks` array (the page builder, `objects/page-builder.ts`) and an `seo` object.

## Collections and entries

A `collection` describes a section of the site: its slug, list layout (`blog`, `cards`, `gallery`, `docs`), sort order, which optional entry fields its entries use, and display options (tag filter, table of contents, related entries).

An `entry` belongs to one collection through a reference. Every field except title, slug and collection is optional, so one type covers articles (`body`), galleries (`images`), case studies (`details`), designed pages (`blocks`) and docs (`body`, `group`, `order`).

The **Fields on this entry** setting (`sections`) is copied from the collection when an entry is created and hides the fields an entry does not use. `shared/entry-fields.ts` lists them.

> [!TIP]
> **When a collection outgrows the generic entry**, for example projects that need filtering by client, add a dedicated document type and a template for it, like any other Nuxt route.

## Links

The `link` object powers buttons, menus and footer links. It points either to a document (`page`, `collection` or `entry`) or to a URL, anchor, route or `mailto:`. The `LINK` projection in `queries.ts` resolves it to a `to` string, in the visitor's language when the target has a translation.

## Rich text

`blockContent` is Portable Text with headings (H2–H4), quotes, lists, bold, italic, code, underline, strike-through and links, plus these objects:

| Type | Rendered as |
| --- | --- |
| `image` | `AppImage` with an optional caption |
| `callout` | `UAlert` |
| `code` | `ProsePre` with Shiki highlighting, file icon and copy button |
| `codeGroup` | `ProseCodeGroup`, one tab per code block |
| `table` | Nuxt UI prose table; the first row is the header |

`PortableText.vue` renders it with `SanityContent` from `@nuxtjs/sanity`.

## Settings

`settings` is a singleton with the ID `settings`. With several languages, copies with the IDs `settings-<language>` hold translated fields; see [Languages](./languages.md).
