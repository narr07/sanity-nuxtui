---
title: Languages
description: How document translations, language prefixes, fallbacks and translated interface text work.
group: Developer guide
order: 307
---

# Languages

Languages are configured in the Studio, not in code: **Site Settings → Languages** holds the site language, the other languages and the fallback setting. Editors can turn them on without a deploy. See [Translating content](../editor-guide/translating-content.md) for the editor side.

## In the Studio

Pages, collections and entries are translated with [@sanity/document-internationalization](https://github.com/sanity-io/plugins/tree/main/plugins/%40sanity/document-internationalization): one document per language, each with a `language` field, linked by a `translation.metadata` document.

- `supportedLanguages` is read from Site Settings when the Studio loads (`getLanguages()` in `schemaTypes/shared/language.ts`), so reload after changing languages.
- New documents start in the site language through the `language` field's initial value.
- Slugs only need to be unique within a language (`isUniqueInLanguage`).
- When an entry is translated, the plugin's `callback` in `sanity.config.ts` points the copy at the collection's translation in the same language.
- Site Settings per language are documents with the IDs `settings-<language>`, listed by `structure.ts`.

Documents created before languages were turned on have no `language`. Queries treat them as the site language with `coalesce(language, $defaultLanguage)`.

## URLs

The site language has no prefix; every other language has its tag as the first segment.

| | Site language (`en`) | Other language (`id`) |
| --- | --- | --- |
| Homepage | `/` | `/id` |
| Page | `/about` | `/id/tentang` |
| Entry | `/blog/hello` | `/id/blog/halo` |

`splitLanguagePath()` in `app/utils/language.ts` reads the language from a path, and `localePath()` adds it. A prefix for the site language (`/en/about`) redirects to the unprefixed URL; the Presentation tool links that way, since it does not know the site language.

## Queries

| Parameter | Meaning |
| --- | --- |
| `$language` | The language of the current URL |
| `$defaultLanguage` | The site language |
| `$languages` | Every language the site serves |
| `$fallback` | Show untranslated pages in the site language |

- `IN_LANGUAGE` selects documents in the current language.
- `translated('page')` follows a reference to its translation in the current language, falling back to the referenced document. Links and Collection List blocks use it, so they can point at one language and still follow the visitor.
- `TRANSLATIONS` lists the language versions of a document; the language switcher and the `hreflang` links use it.
- `find()` looks up a document in the current language, then, with `$fallback`, in the site language. The result's `language` tells the page it is showing a fallback, which then adds a note and `noindex`.

## Site Settings and interface text

`SETTINGS_QUERY` reads each translatable field from `settings-<language>` first and falls back to the main settings. Interface text (`labels`) is merged in `app.vue`: English defaults from `app/utils/labels.ts`, then the main settings, then the current language. Components read it with `useLabels()`:

```ts
const t = useLabels()
t('photos', { count: 12 }) // "12 photos", or the translated label
```

To add a label, add it to `DEFAULT_LABELS` in `labels.ts` and to `LABELS` in the settings schema.

## Nuxt UI text

Nuxt UI translates its own text (close buttons, carousel arrows, the search placeholder) through locales. `modules/ui-locales.ts` generates one lazy import per Nuxt UI locale, and `loadUiLocale()` loads only the language being viewed, picking the closest match: `pt-BR` → `pt_br`, then `pt`, then English. `app.vue` passes it to `<UApp :locale>`.

## SEO

- `<html lang>` and `og:locale` follow the page language. Nuxt SEO sets them from its site config, which knows one language only, so `app.vue` rewrites the final tags in a `tags:resolve` hook.
- Pages with translations get `hreflang` links, with `x-default` on the site language.
- The sitemap lists every language and adds the translations of each URL as alternatives.
