---
title: Collections and entries
description: Create a blog, a portfolio or any other section that repeats, and fill it with entries.
group: Editor guide
order: 204
---

# Collections and entries

A collection is a list of things of the same kind: blog posts, projects, photo galleries, team members, or the pages of these docs. Each collection has a list page, and every item in it (an **entry**) has its own page.

| | Address |
| --- | --- |
| Collection "Blog" with the slug `blog` | `/blog` |
| Entry "Hello world" in that collection | `/blog/hello-world` |

## Create a collection

1. Go to **Collections** and click **+**.
2. Write a **Title**, for example *Services*, and generate the **Slug**. It becomes the address of the list: `/services`.
3. Optionally add a **Description** for the list page, and the **Entry name** (*Service*), used in labels such as "Related services".
4. On the **Display** tab, choose how the collection looks and behaves (see below).
5. Optionally add **Blocks below the list**, such as a call to action.
6. Click **Publish**, then add the collection to the menu in **Site Settings → Header → Navigation**.

## Display options

**List layout** decides how the list page and the entry pages look:

| Layout | Good for | What it shows |
| --- | --- | --- |
| Blog | Articles, news | Date, excerpt, authors, cover image |
| Cards | Projects, services | Cover image and excerpt |
| Gallery | Photo albums | Photo tiles with a photo count |
| Docs | Guides, help centers | A sidebar grouped by topic, a table of contents and previous/next links |

The other options:

- **Sort entries by**: newest, oldest, title, or manual order (the *Order* field of each entry).
- **Entry fields**: which fields entries in this collection use: Body, Photos, Blocks, Details, Authors. Fields you leave out are hidden, so the form stays short.
- **Show tag filter**: buttons above the list to filter by tag.
- **Show table of contents**: the headings of an entry listed next to it, highlighting the one being read.
- **Show related entries**: up to three entries with a shared tag under each entry.

## Add an entry

1. Open **Collections → your collection → Entries** and click **+**. The entry is assigned to that collection automatically.
2. Write the **Title**, generate the **Slug**, and add an **Excerpt**: the short text shown on cards and in search results.
3. Add a **Cover image** if the layout shows one.
4. Fill in the fields the collection uses:
   - **Body**: the text, with headings, lists, links, images, callouts and code.
   - **Photos**: drag several photos at once. They appear as a grid with a full-screen viewer.
   - **Blocks**: the same blocks as on pages, shown after the body.
5. On the **Meta** tab, set the **Date**, **Authors**, **Tags**, **Details** and, for manual sorting, the **Order**.
6. Click **Publish**.

**Details** are short facts shown as a small table at the top of the entry, such as *Client: Acme* or *Year: 2026*. A detail can link somewhere.

**Fields on this entry** (Meta tab) starts with the collection's entry fields. Tick another field to use it on this one entry only.

## Docs collections

With the **Docs** layout, the **Sidebar group** of each entry (Meta tab) decides where it appears in the sidebar, and **Order** decides its position. Entries with the same group are listed together, in the order of the Order field. Set **Sort entries by** to manual order.

## Show entries elsewhere

Add a **Collection List** block to any page to show the latest entries of a collection. It updates by itself when new entries are published.

## Tags

Type a tag and press Enter to add it. Keep tags lowercase and short: `design`, `case-study`. Tags power the tag filter and related entries.
