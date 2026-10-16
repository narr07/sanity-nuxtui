---
title: How it works
description: The five ideas behind the template, explained without code.
group: Get started
order: 102
---

# How it works

You only need a handful of ideas to understand the whole template.

## 1. Two apps: the Studio and the site

The **Studio** is where content is written. It is a web app, either on your computer while developing or hosted at an address such as `your-name.sanity.studio`.

The **site** is what visitors see. It reads the published content from Sanity and shows it with the design of the template.

The two never need to be deployed together. Publishing in the Studio is enough to update the site; developers only deploy when the code changes.

## 2. Pages are made of blocks

A page is a stack of blocks. Each block is one section of the page: a hero at the top, a row of features, a pricing table, a call to action at the bottom. Editors add, reorder and remove blocks; the design of each block is already done.

The homepage is simply the page with the slug `home`.

## 3. Collections hold things that repeat

When you have many items of the same kind, such as blog posts, projects or photo galleries, you make a **collection**. A collection has a list page (for example `/blog`), and each item, called an **entry**, gets its own page (`/blog/my-post`).

Editors can create new collections in the Studio. A "Services" or "Team" section does not need a developer.

## 4. Drafts, then publish

Everything you type is saved as a **draft** right away. Visitors only see a change after you click **Publish**. The **Presentation** view in the Studio shows your drafts on the real site, so you can check a page before anyone else sees it.

## 5. Settings for the whole site

The site name, the menu, the footer, the social links and the languages live in **Site Settings**. Change them once and every page follows.

## A word on speed

Published pages are cached, which means visitors get a ready-made copy instead of the site building it again for every visit. After you publish, the cached copy refreshes within about a minute.

## Next steps

- Editors: take the [Studio tour](../editor-guide/studio-tour.md).
- Developers: go to [Installation](../developer-guide/installation.md).
