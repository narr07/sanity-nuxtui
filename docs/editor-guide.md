# Editor guide

How to manage the website in Sanity Studio. No code needed.

Open the Studio (locally at http://localhost:3333, or your `*.sanity.studio` URL) and log in.

## The Studio menu

| Menu item          | What it holds                                                 |
| ------------------ | ------------------------------------------------------------- |
| **Pages**          | Every page built from blocks: Home, About, Pricing, …         |
| **Blog → Posts**   | Blog posts                                                    |
| **Blog → Authors** | People shown on posts                                         |
| **Galleries**      | Photo galleries                                               |
| **Site Settings**  | Site name, logo, navigation, footer and default SEO           |

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
   - `blog` and `gallery` are reserved.
3. Under **Blocks**, click **Add item** and choose a block. Blocks are grouped:
   - **Intro**: Hero, Logo Cloud
   - **Content**: Features Section, Card Grid, Timeline, Image Gallery, Rich Text
   - **Social proof**: Testimonials, FAQ
   - **Conversion**: Pricing, Call to Action, Callout
   - **Dynamic lists**: Latest Posts, Latest Galleries (they update automatically)
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
  - *Internal content*: pick a page, post or gallery. The link updates automatically if its slug changes.
  - *URL*: a full URL (`https://…`), a route (`/blog`), an anchor (`#features`) or `mailto:hello@example.com`.
- **Open in new tab**, **Leading/Trailing icon**, **Color** and **Variant**.

## Blog posts

1. **Blog → Posts → +**.
2. Fill in **Title**, generate the **Slug**, write an **Excerpt** (shown on cards and in search results) and upload a **Cover image**.
3. Write the **Body**. The toolbar has headings, bold, italic, code, links and lists. With **+** in the editor you can insert an **Image**, a **Callout** or a **Code** block.
4. On the **Meta** tab, set **Published at**, pick **Authors** and add **Tags** (type and press Enter).
5. **Publish**. The post appears on `/blog`, in every *Latest Posts* block, and in the sitemap.

Posts that share a tag are shown as *Related posts* under each other. Readers can filter `/blog` by tag.

## Galleries

1. **Galleries → +**, then add a title and generate the slug.
2. Drag several photos onto **Photos** at once to upload them in bulk. The first photo is the cover.
3. Click a photo to add **Alternative text** (describes the image for screen readers) and an optional **Caption**.
4. **Publish**. The gallery appears on `/gallery` and in every *Latest Galleries* block.

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

Every page, post and gallery has an **SEO** tab:

- **Meta title** and **Meta description**: what search engines show. When empty, the title and excerpt/description are used.
- **Social share image**: shown when the link is shared. When empty, the cover image or the default from Site Settings is used.
- **Hide from search engines**: removes the page from the sitemap and adds `noindex`.

## Live preview (Presentation)

Open **Presentation** to see the site next to the editor.

- Click any text in the preview to jump to its field.
- Drag blocks in the preview to reorder them.
- Unpublished changes are visible in the preview only.

If the preview shows a connection error, ask a developer to set up the read token (see the README).
