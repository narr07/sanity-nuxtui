---
title: Pages and blocks
description: Create a page, choose its address, and build it from blocks.
group: Editor guide
order: 202
---

# Pages and blocks

A page is a stack of blocks. You choose the blocks and write the text; the design of each block is already done and works on phones, tablets and in dark mode.

## Create a page

1. Go to **Pages** and click **+**.
2. Write a **Title**, then click **Generate** next to **Slug**. The slug is the address of the page: `about` becomes `/about`.
3. Under **Blocks**, click **Add item** and pick a block.
4. Fill in the block, add more blocks, then click **Publish**.

A few rules about slugs:

- The page with the slug `home` is the homepage.
- Slugs can contain slashes to nest pages: `company/team` becomes `/company/team`.
- A page cannot use the slug of a collection, such as `blog`. The Studio warns you.

> [!NOTE]
> **New pages are not in the menu yet.** Add a link in **Site Settings → Header → Navigation** when the page should appear there.

## Work with blocks

- Drag the handle (⋮⋮) on a block to move it up or down.
- Use the **⋯** menu on a block to duplicate or remove it.
- Click a block to open it; click outside to close it.

Blocks are grouped in the **Add item** menu:

| Group | Blocks |
| --- | --- |
| Intro | Hero, Logo Cloud |
| Content | Features Section, Card Grid, Timeline, Image Gallery, Rich Text |
| Social proof | Testimonials, FAQ |
| Conversion | Pricing, Call to Action, Callout |
| Dynamic lists | Collection List |

Each block is described in [Blocks](./blocks.md).

## Options most blocks share

| Option | What it does |
| --- | --- |
| Headline | A small label above the title, shown with a number and a line |
| Title, Description | The main heading and the text under it |
| Buttons | Up to four buttons, see below |
| Anchor ID | A name to jump to the section. With `faq`, a button can link to `#faq`, or `/pricing#faq` from another page |
| Orientation | *Horizontal* puts the image next to the text |
| Reverse | With horizontal orientation, shows the image first |
| Icon | An icon name such as `i-lucide-rocket`, see below |

## Buttons and links

Buttons, menu items and footer links all work the same way.

- **Label**: the text on the button.
- **Link type**:
  - *Internal content*: pick a page, a collection or an entry. The link keeps working when the slug changes, and follows the visitor's language when the target is translated.
  - *URL*: a full address (`https://…`), a path on the site (`/blog`), an anchor (`#features`) or an email link (`mailto:hello@example.com`).
- **Open in new tab**, a **leading** or **trailing icon**, a **color** and a **variant** (solid, outline, soft, subtle, ghost or link).

## Icons

Icons are written as names. Browse them at [icones.js.org](https://icones.js.org), open the **Lucide** set for general icons or **Simple Icons** for brand logos, and copy the name with an `i-` in front: `i-lucide-rocket`, `i-simple-icons-github`.
