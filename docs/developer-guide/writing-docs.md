---
title: Writing these docs
description: How the guides are written in Markdown and imported into the Docs collection.
group: Developer guide
order: 313
---

# Writing these docs

The guides you are reading live as Markdown files in the `docs/` folder of the repository, readable on GitHub. `npm run docs:import` turns them into entries of a **Docs** collection with the docs layout, served at `/docs`. `npm run seed` runs the same import.

## Add or change a guide

1. Create or edit a file in `docs/`. Sub-folders are only for your own order; the file name is the slug: `developer-guide/deployment.md` → `/docs/deployment`.
2. Start it with front matter:

   ```yaml [docs/developer-guide/deployment.md]
   ---
   title: Deployment
   description: One-line summary, shown on cards and in search.
   group: Developer guide
   order: 312
   ---
   ```

3. Run the import:

   ```sh
   npm run docs:import
   ```

Running it again updates the entries with the same slug. `npm run docs:import -- --prune` also deletes entries whose file was removed. After an import, the entries can still be edited in the Studio, but the next import overwrites them, so keep the files as the source.

## Supported Markdown

| Markdown | Becomes |
| --- | --- |
| `##`, `###`, `####` headings | Headings, listed in the table of contents |
| Lists, bold, italic, `code`, links | The same in rich text |
| Links to other `.md` files | Links to their pages under `/docs` |
| Fenced code with a language and a file name in brackets, `ts [file.ts]` | A code block with language and file name |
| Fences between `<!-- code-group -->` and `<!-- /code-group -->` | A code group with tabs |
| `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` | A callout; a **bold** first sentence becomes its title |
| Tables | A table |

The converter is `studio/scripts/lib/markdown.ts`; the importer is `studio/scripts/lib/docs.ts`.

## The docs layout

Any collection can use it: set **List layout** to *Docs*. The sidebar groups entries by their **Sidebar group** and orders them by **Order**; entry pages get a table of contents and previous/next links. See [Collections and entries](../editor-guide/collections.md).
