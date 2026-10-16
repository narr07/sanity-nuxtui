---
title: Translating content
description: Publish the site in more than one language, page by page.
group: Editor guide
order: 207
---

# Translating content

The site starts with one language. When you need more, each page, collection and entry gets a translated copy that you edit and publish on its own.

## Turn on more languages

1. Open **Site Settings → Languages**.
2. Check the **Site language**, written as a language tag: `en` for English, `id` for Indonesian, `de` for German, `pt-BR` for Brazilian Portuguese.
3. Turn on **Multiple languages** and add the **Other languages**.
4. Publish, then reload the Studio.

The site language keeps its addresses (`/about`). Other languages get their tag in front (`/id/tentang`), and a language menu appears in the header.

## Translate a document

1. Open the page, collection or entry.
2. Click **Translations** at the top of the document and pick a language.
3. A copy opens in that language. Translate the text, give it a slug in that language, and publish.

Each language is published separately, so a translation can go live later than the original.

> [!TIP]
> **Translate collections before their entries.** A translated entry moves to the collection in its own language by itself, but only if that collection already exists.

## Menus and footer per language

With several languages, **Site Settings** turns into a list: the main settings and one copy per language. In a language copy, fill in only what changes, typically the menu labels, the footer text and the interface text. Empty fields use the main settings.

Menu links can stay as they are: a link to *About* opens the translated About page for visitors reading in that language.

## Pages that are not translated yet

**Show untranslated pages in the site language** (in Site Settings → Languages) decides what visitors see when a page has no translation:

- **On** (the default): the page opens in the site language, with the menus of the visitor's language and a short note that it is not translated yet.
- **Off**: the address does not exist in that language, and the language menu leads to that language's homepage.

## Content from before

Pages created before you turned on languages belong to the site language. To translate one of them, open its **Translations** menu and choose its language first; then the other languages become available.
