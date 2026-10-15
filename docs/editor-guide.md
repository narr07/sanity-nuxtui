# Editor guide

How to manage the website in Sanity Studio. No code needed.

Open the Studio (locally at http://localhost:3333, or your `*.sanity.studio` URL) and log in.

## The Studio menu

| Menu item         | What it holds                                                             |
| ----------------- | ------------------------------------------------------------------------- |
| **Pages**         | One-off pages built from blocks: Home, About, Pricing, …                  |
| **Collections**   | Repeating content: Blog, Gallery, Projects, … Open one to see its entries |
| **All entries**   | Every entry of every collection, in one list                              |
| **Authors**       | People shown on entries                                                   |
| **Site Settings** | Site name, logo, navigation, footer and default SEO                       |

Tabs at the top of the Studio:

- **Structure**: edit content in forms.
- **Presentation**: edit next to a live preview of the site.
- **Vision**: run GROQ queries (for developers).

## Publishing

Changes are saved as a **draft** automatically. Nothing changes on the site until you click **Publish** (bottom right). Use the **⋯** menu next to it to unpublish, duplicate or delete. **History** (clock icon) lets you restore an earlier version.

## Pages

1. Go to **Pages** and click **+** (or open an existing page).
2. Fill in **Title** and click **Generate** next to **Slug**. The slug is the URL: `about` becomes `/about`.
   - The page with slug **`home`** is the homepage.
   - A page can't use the slug of a collection (e.g. `blog`).
3. Under **Blocks**, click **Add item** and choose a block. Blocks are grouped:
   - **Intro**: Hero, Logo Cloud
   - **Content**: Features Section, Card Grid, Timeline, Image Gallery, Rich Text
   - **Social proof**: Testimonials, FAQ
   - **Conversion**: Pricing, Call to Action, Callout
   - **Dynamic lists**: Collection List (shows the latest entries of a collection and updates automatically)
4. Drag the handle (⋮⋮) on a block to reorder it. Use **⋯** on a block to duplicate or remove it.
5. Click **Publish**.

To add the page to the menu, add a link to it in **Site Settings → Header → Navigation**.

### Common block options

| Option          | What it does                                                                 |
| --------------- | ---------------------------------------------------------------------------- |
| Headline        | Small label above the title                                                  |
| Anchor ID       | Lets a button jump to the section. Anchor `faq` → link to `#faq` or `/pricing#faq` |
| Orientation     | *Horizontal* puts the image next to the text                                 |
| Reverse         | With horizontal orientation, shows the image first                          |
| Icon            | An icon name such as `i-lucide-rocket`. Browse icons at [icones.js.org](https://icones.js.org): pick an icon from **Lucide** or **Simple Icons** and copy its name, prefixed with `i-` |
| Color / Variant | Button and component styles: `primary`, `neutral`, `solid`, `outline`, …     |

### Buttons and links

Every button has:

- **Label**: the text on the button.
- **Link type**:
  - *Internal content*: pick a page, a collection or an entry. The link updates automatically if its slug changes.
  - *URL*: a full URL (`https://…`), a route (`/blog`), an anchor (`#features`) or `mailto:hello@example.com`.
- **Open in new tab**, **Leading/Trailing icon**, **Color** and **Variant**.

## Collections

A collection is a list of entries that shares one address. The **Blog** collection lists its posts at `/blog`, and each post lives at `/blog/<slug>`. Blog, Gallery and Projects are all collections, and you can add your own, such as Services, Team or Events.

### Create a collection

1. **Collections → +**.
2. Enter a **Title** (e.g. *Services*) and generate the **Slug**. The slug is the address of the list: `/services`.
3. Optionally write a **Description** and set the **Entry name** (e.g. *Service*), used in labels such as "Related services".
4. On the **Display** tab:
   - **List layout**: *Blog* (date, excerpt and authors), *Cards* (cover image and excerpt) or *Gallery* (photo tiles with a photo count).
   - **Sort entries by**: newest, oldest, title, or manual order.
   - **Show tag filter**: buttons above the list to filter by tag.
   - **Show related entries**: up to three entries with a shared tag under each entry.
5. Under **Blocks below the list** you can add, for example, a call to action.
6. **Publish**, then add the collection to the menu in **Site Settings → Header → Navigation**.

### Add an entry

1. **Collections → *your collection* → Entries → +**. The entry is assigned to that collection automatically.
2. Fill in **Title**, generate the **Slug**, write an **Excerpt** (shown on cards and in search results) and upload a **Cover image**.
3. Use whichever fields fit. All of them are optional:
   - **Body**: rich text with headings, bold, italic, code, links and lists. Use **+** in the editor to insert an **Image**, a **Callout** or a **Code** block.
   - **Photos** tab: drag several photos at once to upload them in bulk. They are shown as a grid that opens a lightbox. Click a photo to add **Alternative text** and a **Caption**. Without a cover image, the first photo is used as the cover.
   - **Blocks** tab: the same blocks as on pages, shown after the body and photos.
   - **Meta** tab: **Date**, **Authors**, **Tags** (type and press Enter), **Details** and **Order**.
4. **Publish**. The entry appears on the collection page, in every *Collection List* block for that collection, and in the sitemap.

**Details** are short facts shown as a small table at the top of the entry, for example *Client: Acme*, *Year: 2026*, *Location: Berlin*. Add a link to make a value clickable.

**Order** is only used when the collection sorts by manual order. Lower numbers come first.

### Show entries on a page

Add a **Collection List** block to any page, pick the collection, and choose how many entries to show. Optionally show only entries with a certain tag and add a "View all" button.

## Images

- Always fill in **Alternative text**: describe what the image shows.
- Use **Edit → Hotspot** to mark the important part of an image. Crops on smaller screens keep that part visible.
- Images are resized and converted automatically; upload the largest version you have.

## Site Settings

| Tab     | Fields                                                                     |
| ------- | -------------------------------------------------------------------------- |
| General | Site name, default description, logo, default social share image           |
| Header  | **Navigation** (menu links) and up to two **Header buttons**               |
| Footer  | **Footer columns** (heading + links), footer text, **Social links**        |

Social links need an icon such as `i-simple-icons-instagram`, `i-simple-icons-x` or `i-simple-icons-linkedin`.

## SEO

Every page, collection and entry has an **SEO** tab:

- **Meta title** and **Meta description**: what search engines show. When empty, the title and excerpt/description are used.
- **Social share image**: shown when the link is shared. When empty, the cover image or the default from Site Settings is used.
- **Hide from search engines**: removes the page from the sitemap and adds `noindex`.

## Live preview (Presentation)

Open **Presentation** to see the site next to the editor.

- Click any text in the preview to jump to its field.
- Drag blocks in the preview to reorder them.
- Unpublished changes are visible in the preview only.

If the preview shows a connection error, ask a developer to set up the read token (see the README).
