# Sanity × Nuxt UI

A block-based website builder. Editors compose pages from blocks in **Sanity Studio**; the **Nuxt** site renders every block with **Nuxt UI** components.

- **13 page-builder blocks**: hero, features, card grid, timeline, image gallery, rich text, testimonials, FAQ, pricing, call to action, callout, logo cloud and collection list
- **Collections created in the Studio, no code needed**: Blog, Gallery, Projects, Services, Team… Each collection gets a list page (`/projects`) and entry pages (`/projects/<slug>`), with a blog, cards or gallery layout, sorting, tag filtering and related entries
- **Flexible entries**: rich text, photo galleries with a lightbox, key details (Client, Year, …), authors, tags and page-builder blocks, all optional
- **Site settings**: logo, navigation, header buttons, footer columns and social links, all editable
- **Visual Editing**: click any text in the Presentation tool to edit it, with live draft preview
- **Site search**: a search palette (Ctrl/⌘ + K) over pages, collections and entries, ranked by Sanity, in the language being viewed
- **Multiple languages, optional**: switch them on in Site Settings. Each page, collection and entry is translated as its own document, URLs get a language prefix (`/id/about`), and the site adds a language switcher, hreflang links and a multilingual sitemap
- **Images** through [Nuxt Image](https://image.nuxt.com/providers/sanity) and the Sanity CDN: responsive `srcset`, Studio crop and hotspot, and a pixelated placeholder while loading
- **Code blocks** like the Nuxt UI docs: syntax highlighting, file icons, copy button, highlighted lines and tabbed code groups
- **SEO** with [Nuxt SEO](https://nuxtseo.com): sitemap from your content, robots.txt, schema.org, and **OG images generated in your theme** for pages without an image
- **Deploy anywhere**: server rendering with ISR (Vercel) or stale-while-revalidate (Cloudflare, Node), hybrid prerendering, or a fully static site
- **Type-safe** from schema to component with Sanity TypeGen
- **Example content** in one command

```
apps/
├─ studio/   Sanity Studio: schemas, structure, Presentation tool, seed script
└─ web/      Nuxt 4 + Nuxt UI 4: block components, pages, SEO
```

> New to the Studio? Read the [editor guide](docs/editor-guide.md).

## Quick start

Requirements: Node 24+, pnpm, and a [Sanity](https://www.sanity.io) account.

```bash
pnpm install
```

### 1. Create or pick a Sanity project

Create a project at [sanity.io/manage](https://www.sanity.io/manage) (or run `pnpm --filter studio exec sanity init --bare`) and copy its project ID.

### 2. Configure the environment

```bash
cp apps/studio/.env.example apps/studio/.env
cp apps/web/.env.example apps/web/.env
```

Set `SANITY_STUDIO_PROJECT_ID` and `NUXT_SANITY_PROJECT_ID` to your project ID.

### 3. Log in and allow the site to read content

```bash
pnpm --filter studio exec sanity login
pnpm --filter studio exec sanity cors add http://localhost:3000 --credentials
```

Use the same login method (Google, GitHub or email) that owns the project; Sanity treats each method as a separate account.

### 4. Add example content (optional)

```bash
pnpm seed
```

Creates site settings, Home/About/Pricing/Contact pages, two authors and three collections: **Blog** (5 posts), **Gallery** (3 galleries) and **Projects** (3 projects), with photos from [Unsplash](https://unsplash.com) via picsum.photos. It stops if the dataset already has content; `pnpm seed --replace` deletes existing pages, collections, entries, authors and settings first.

### 5. Run

```bash
pnpm dev
```

| App    | URL                   |
| ------ | --------------------- |
| Site   | http://localhost:3000 |
| Studio | http://localhost:3333 |

If port 3000 is taken, Nuxt picks the next free port. Set `SANITY_STUDIO_PREVIEW_URL` in `apps/studio/.env` to match and add that origin to CORS.

## Content model

| Type         | Studio menu        | URL                         | Rendered by                                  |
| ------------ | ------------------ | --------------------------- | -------------------------------------------- |
| `page`       | Pages              | `/<slug>`                   | `PageBlocks.vue`                             |
| `collection` | Collections        | `/<collection>`             | `CollectionView.vue` → `EntryList.vue`       |
| `entry`      | Collections → *X*  | `/<collection>/<entry>`     | `EntryView.vue`                              |
| `author`     | Authors            | —                           | Shown on entries                             |
| `settings`   | Site Settings      | every page                  | `app/app.vue` (header, footer, SEO)          |

Every URL goes through one route, `app/pages/[...slug].vue`, which runs `ROUTE_QUERY` and renders whichever matches: a page, a collection or an entry.

- The page with slug `home` is the homepage (`/`). Nested slugs like `company/team` work.
- A page and a collection can't share a slug (the Studio validates this). If a page and an entry share a path, the page wins.

### Collections

Collections let editors add new sections to the site from the Studio, with no code and no deploy.

1. **Collections → +** in the Studio. The slug is the list URL (`services` → `/services`).
2. On the **Display** tab, choose:
   - **List layout**: *Blog* (date, excerpt, authors), *Cards* (cover and excerpt) or *Gallery* (photo tiles with a count)
   - **Sort**: newest, oldest, title, or manual (the *Order* field on each entry)
   - **Show tag filter** (`/services?tag=design`), **Show table of contents** (a sticky `UContentToc` built from the body's H2/H3 headings) and **Show related entries**
   - **Entry fields**: which optional fields entries use (Body, Photos, Blocks, Details, Authors). Unused fields and tabs are hidden in the Studio. A gallery collection only needs Photos, a blog only Body and Authors.
3. Open the collection → **Entries → +**. New entries are assigned to the collection automatically.

New entries copy the collection's entry fields into their own **Fields on this entry** setting (Meta tab), so a single entry can still turn on, say, Photos. Every entry field is optional, so one entry type covers articles (**Body**), galleries (**Photos**), case studies (**Details** such as *Client: Acme*) and fully designed pages (**Blocks**). Show entries anywhere with the **Collection List** block.

When a collection needs fields or behaviour the generic entry can't express (say, filtering projects by client), add a dedicated document type and template in code, like any other Nuxt route.

## Blocks

| Block              | Nuxt UI components                              | Schema (`apps/studio/schemaTypes/blocks/`) | Component (`apps/web/app/components/blocks/`) |
| ------------------ | ----------------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| Hero               | `UPageHero`                                     | `hero.ts`                                  | `BlockHero.vue`                               |
| Logo Cloud         | `UPageLogos`                                    | `logos.ts`                                 | `BlockLogos.vue`                              |
| Features Section   | `UPageSection` (`features`)                     | `section.ts`                               | `BlockSection.vue`                            |
| Card Grid          | `UPageGrid`, `UPageCard`                        | `card-grid.ts`                             | `BlockCardGrid.vue`                           |
| Timeline           | `UTimeline`                                     | `timeline.ts`                              | `BlockTimeline.vue`                           |
| Image Gallery      | `UCarousel`, `UModal`                           | `image-gallery.ts`                         | `BlockImageGallery.vue`                       |
| Rich Text          | Portable Text, `UAlert`                         | `rich-text.ts`                             | `BlockRichText.vue`                           |
| Testimonials       | `UPageColumns`, `UPageCard`, `UUser`            | `testimonials.ts`                          | `BlockTestimonials.vue`                       |
| FAQ                | `UAccordion`                                    | `faq.ts`                                   | `BlockFaq.vue`                                |
| Pricing            | `UPricingPlans`, `UPricingPlan`                 | `pricing.ts`                               | `BlockPricing.vue`                            |
| Call to Action     | `UPageCTA`                                      | `cta.ts`                                   | `BlockCta.vue`                                |
| Callout            | `UAlert`                                        | `callout.ts`                               | `BlockCallout.vue`                            |
| Collection List    | `UBlogPosts` / `UPageGrid`, `UPageCard`         | `collection-list.ts`                       | `BlockCollectionList.vue`                     |

Field names and option values match the Nuxt UI props (`orientation`, `variant`, `color`, `icon`, …), so each component passes them straight through and the Nuxt UI docs double as field documentation.

### Adding a block

Any Nuxt UI component can become a block.

1. **Schema**: create `apps/studio/schemaTypes/blocks/<name>.ts`, then register it in `schemaTypes/index.ts` and in `objects/page-builder.ts` (also pick an insert-menu group there).
2. **Query** (only when the block has references or links): add a projection for it in `apps/web/app/utils/queries.ts` → `PAGE_QUERY`.
3. **Types**: run `pnpm typegen`.
4. **Component**: create `apps/web/app/components/blocks/Block<Name>.vue`:

   ```vue
   <script setup lang="ts">
   import { stegaClean } from '@sanity/client/stega'
   import type { BlockOf } from '~/types/sanity'

   defineProps<{ block: BlockOf<'stats'>, index: number }>()
   </script>

   <template>
     <UPageSection :title="block.title">
       <!-- … -->
     </UPageSection>
   </template>
   ```

5. **Register** it in the `registry` in `apps/web/app/components/PageBlocks.vue`. The registry is typed as `Record<BlockType, Component>`, so `pnpm typecheck` fails until every block has a component.

Use `stegaClean()` on any value that drives logic (icons, colors, variants, URLs, anchors). During Visual Editing, strings carry invisible markers that would otherwise break icon names and class names. `toButton()` / `toButtons()` in `app/utils/links.ts` do this for links.

### Links

The `link` object (buttons, navigation, footer) points to a page, collection or entry, or to any URL, anchor (`#faq`), route (`/blog`) or `mailto:`. The `LINK` projection in `queries.ts` resolves references to paths, so components only see a `to` string. When the target has a translation in the visitor's language, the link goes there.

## Languages

The site has one language until you turn on more. Everything is set in the Studio:

1. **Site Settings → Languages**: set the **Site language** (a tag such as `en`, `id` or `pt-BR`), turn on **Multiple languages** and add the **Other languages**.
2. Reload the Studio. Pages, collections and entries now show a **Translations** menu in the document header.
3. Open a document, pick a language in the menu, then translate the copy that opens (including its slug) and publish it.

| | Site language | Other languages |
| --- | --- | --- |
| URL | `/about`, `/blog/post` | `/id/about`, `/id/blog/post` |
| Homepage | `/` | `/id` |

How it works:

- **One document per language** ([@sanity/document-internationalization](https://github.com/sanity-io/plugins/tree/main/plugins/%40sanity/document-internationalization)). Translations are linked by a `translation.metadata` document, so each language can have its own blocks, slugs and SEO, and is published on its own.
- **Collections first**: translate a collection before its entries. A translated entry moves to the collection in its own language automatically.
- **Site Settings per language**: Site Settings becomes a list with the main settings and one copy per language. Copies only need the fields that change (menu labels, footer text, interface text); empty fields fall back to the main settings. Links in the menu can stay as they are: they follow the visitor's language.
- **Interface text**: text written by the site itself ("On this page", "Related posts", the empty states, …) is under **Site Settings → Interface text**. Nuxt UI's own text (close buttons, carousel arrows) comes from its [built-in locales](https://ui.nuxt.com/docs/getting-started/integrations/i18n/nuxt), loaded only for the language being viewed.
- **SEO**: `<html lang>`, `og:locale`, `hreflang` links between translations (with `x-default` on the site language) and sitemap entries with their alternatives.
- **Existing content**: documents created before languages were turned on have no language and belong to the site language. To translate one, open its Translations menu and choose its language first.
- **Untranslated pages**: with **Show untranslated pages in the site language** on (the default), `/id/pricing` shows the page in the site language with the menus and interface text of the other language, a short note, and `noindex`, and links keep visitors in their language. Off, such URLs return 404 and the language switcher leads to the homepage of that language.
- **Turning it off** hides the other languages from the site; their documents stay in the dataset.

Language tags are not limited to Nuxt UI's list: a language without a Nuxt UI locale uses the closest match (`pt-BR` → `pt_br` → `pt`) or English.

## Visual Editing

1. Create a token with the **Viewer** role: `pnpm --filter studio exec sanity tokens add "Preview" --role viewer`, or at sanity.io/manage → API → Tokens.
2. Set `NUXT_SANITY_API_READ_TOKEN` in `apps/web/.env` and restart the site.
3. Open **Presentation** in Studio.

Click any text to open its field, and drag blocks in the preview to reorder them. Drafts appear as you type. The token is only used server-side.

Visitors never see drafts: the site only shows them in a browser that went through `/preview/enable`, which the Presentation tool opens with a one-time secret.

Cached pages and drafts in production:

- **Vercel**: one deployment does both. Pages stay cached with ISR, and `/preview/enable` also sets Vercel's `__prerender_bypass` cookie, so the Presentation tool skips the cache and sees drafts ([`server/preview/enable.ts`](apps/web/server/preview/enable.ts)).
- **Other hosts** (Cloudflare, Node): caching is turned off when a read token is set, because their cache cannot be skipped for a single visitor. Use two deployments of `apps/web`: the public site without a token, and a preview deployment with the token that the Studio's `SANITY_STUDIO_PREVIEW_URL` points to.

## Search

The search button in the header (and Ctrl/⌘ + K) opens Nuxt UI's [ContentSearch](https://ui.nuxt.com/docs/components/content-search) palette. Results come from `SEARCH_QUERY` in `queries.ts`: GROQ text matching on titles, excerpts, descriptions, rich text and block headings, ranked with `score()`, limited to the language being viewed. Pages marked "Hide from search engines" are left out.

The browser queries the Sanity CDN directly, so search also works on static hosting. That needs a public dataset and the site's origin in your CORS settings (see [Deployment](#deployment)). Turn search off in **Site Settings → Header → Search**.

## Images

Images go through [`<NuxtImg>`](https://image.nuxt.com/providers/sanity) with Sanity as the default provider, so the Sanity CDN resizes them; no image server is needed.

- `<AppImage :image="block.image" :width="720" sizes="100vw lg:50vw" />` renders a responsive image with the crop and hotspot from the Studio. Pass `height` as well to crop to a fixed aspect ratio around the hotspot.
- Every image query includes `asset->metadata.lqip` (see `IMAGE` in `queries.ts`). `AppImage` shows it as a pixelated placeholder until the real image loads, without JavaScript.
- `useSanityImage()` returns plain URLs (meta tags, schema.org). `sanityImgProps()` prepares images for Nuxt UI components that render `<NuxtImg>` themselves, such as `UBlogPost` and `UAvatar`.

## Code blocks

Rich text has two code types, both edited with [`@sanity/code-input`](https://www.sanity.io/plugins/code-input) (language, file name, highlighted lines):

- **Code**: one block, rendered with `ProsePre`: file name with icon, copy button, syntax highlighting.
- **Code group**: several code blocks shown as tabs (`ProseCodeGroup`), labelled by file name.

Highlighting runs on the server with [Shiki](https://shiki.style) (`server/api/highlight.post.ts`), using the JavaScript regex engine so it also works on Cloudflare Workers. To add a language, import it there and add it to `CODE_LANGUAGES` in `apps/studio/schemaTypes/shared/code.ts`. File icons come from `@iconify-json/vscode-icons`.

## SEO

Configured in `apps/web/nuxt.config.ts` with [`@nuxtjs/seo`](https://nuxtseo.com).

- **Site URL and name**: set `NUXT_SITE_URL` (your production domain) and `NUXT_SITE_NAME`.
- **Meta tags**: every document has an SEO tab (title, description, social image, *Hide from search engines*). Empty fields fall back to the title, excerpt or cover image, then to the defaults in Site Settings. See `app/composables/usePageSeo.ts`.
- **Sitemap**: `/sitemap.xml` includes every page, collection and entry not hidden from search engines (`server/api/__sitemap__/urls.ts`).
- **robots.txt**: generated automatically; indexing is blocked outside production.
- **Structured data**: entries output schema.org `Article` with authors.
- **Social images**, first match wins:
  1. the SEO image of the page, collection or entry
  2. the entry's cover image or first photo
  3. the default image in Site Settings (optional)
  4. an image generated from the title and description in the site theme

  Generated images are rendered by [nuxt-og-image](https://nuxtseo.com/docs/og-image) from `app/components/OgImage/Page.takumi.vue` with the theme fonts (registered with `global: true` in `fonts.families`). Edit that component to change the design. Set `NUXT_APP_SECRET` in production: image URLs are signed and return 403 without it.

## Theming

- Brand colors: `apps/web/app/app.config.ts` (`primary`, `neutral`) and the color scale in `app/assets/css/main.css`.
- Components use semantic classes (`text-muted`, `bg-elevated`, …), so light and dark mode work everywhere.
- Override any component globally in `app.config.ts`. See the [Nuxt UI theming docs](https://ui.nuxt.com/docs/getting-started/theme).

## Scripts

Run from the repository root.

| Command                 | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `pnpm dev`              | Studio and site together                                      |
| `pnpm dev:web`          | Site only                                                     |
| `pnpm dev:studio`       | Studio only                                                   |
| `pnpm build`            | Build Studio and site                                         |
| `pnpm generate`         | Build the site as static files (`NUXT_RENDER_MODE=static`)    |
| `pnpm typegen`          | Extract the schema and regenerate `apps/web/sanity.types.ts`  |
| `pnpm seed`             | Add example content (`--replace` to start over)               |
| `pnpm deploy:studio`    | Deploy Studio to `<name>.sanity.studio`                       |
| `pnpm lint`             | ESLint for the site                                           |
| `pnpm typecheck`        | Type-check the site                                           |

## Rendering modes

Pick one with `NUXT_RENDER_MODE` at build time:

| Mode               | Build                                        | Content changes appear                        | Needs a server |
| ------------------ | -------------------------------------------- | --------------------------------------------- | -------------- |
| `ssr` (default)    | `pnpm build`                                 | within `NUXT_CACHE_TTL` seconds (default 60)  | yes            |
| `hybrid`           | `NUXT_RENDER_MODE=hybrid pnpm build`         | new pages right away, edits after a rebuild   | yes            |
| `static`           | `pnpm generate`                              | after a rebuild                               | no             |

- **hybrid**: every page, collection and entry from Sanity is prerendered at build time and served as a static file. The server still renders pages added after the build, OG images and Visual Editing previews.
- **static**: everything is prerendered into `apps/web/.output/public`, including OG images (`/_og/s/*.png`), the sitemap and the data for client-side navigation. Upload that folder to any static host. Visual Editing needs a separate `ssr` deployment.

For `hybrid` and `static`, rebuild when content is published: create a deploy hook on your host (Cloudflare, Vercel, Netlify…) and add it as a webhook in sanity.io/manage → API → Webhooks, filtered to `_type in ["page", "collection", "entry", "author", "settings"]`.

The list of URLs to prerender comes from Sanity (`apps/web/prerender-routes.ts`), because the crawler only finds pages that are linked from somewhere.

## Deployment

### Studio

`pnpm deploy:studio` hosts it on Sanity. The first time, pass a hostname: `pnpm --filter studio exec sanity deploy --url <name>` publishes it at `https://<name>.sanity.studio` and prints an app ID. Put that ID in `SANITY_STUDIO_APP_ID` (`apps/studio/.env`) so later `pnpm deploy:studio` runs update the same studio. Then add the studio to CORS: `pnpm --filter studio exec sanity cors add https://<name>.sanity.studio --credentials`.

`SANITY_STUDIO_*` variables are built into the studio, so redeploy after changing them. `sanity deploy` builds in production mode and reads `apps/studio/.env.production` after `.env`, so keep `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000` in `.env` for local work and put the deployed site URL in `.env.production`. The hosted Studio can still preview a local dev server: type `http://localhost:3000` in the Presentation address bar.

Or build it with `pnpm --filter studio build` and serve `apps/studio/dist` anywhere.

### Environment variables (site)

Set these as **build** variables: the project ID and site URL are read at build time.

| Variable                     | Required | Purpose                                                                    |
| ---------------------------- | -------- | -------------------------------------------------------------------------- |
| `NUXT_SANITY_PROJECT_ID`     | yes      | Sanity project ID                                                          |
| `NUXT_SANITY_DATASET`        | yes      | Dataset, usually `production`                                              |
| `NUXT_SITE_URL`              | yes      | Public URL, e.g. `https://example.com` (sitemap, canonical, OG image URLs) |
| `NUXT_APP_SECRET`            | yes      | Signs OG image URLs. Generate with `npx nuxt-og-image generate-secret` |
| `NUXT_SITE_NAME`             | no       | Fallback site name                                                         |
| `NUXT_CACHE_TTL`             | no       | Seconds before a cached page is refreshed. Default `60`, `0` disables caching |
| `NUXT_SANITY_API_READ_TOKEN` | no       | Enables Visual Editing. Turns caching off on hosts other than Vercel       |
| `NUXT_SANITY_STUDIO_URL`     | no       | Studio URL, for Visual Editing overlays                                    |

After deploying, add the site URL to CORS (`pnpm --filter studio exec sanity cors add https://example.com --credentials`) and set `SANITY_STUDIO_PREVIEW_URL` in the Studio to your preview deployment.

### Caching

Pages are cached and refreshed in the background, so visitors get a cached page instantly and content edits show up within `NUXT_CACHE_TTL` seconds of publishing. Configured in `apps/web/nuxt.config.ts`:

| Platform           | Mechanism                                                                    |
| ------------------ | ---------------------------------------------------------------------------- |
| Vercel             | ISR (`isr` route rule). The `tag` query is part of the cache key.            |
| Cloudflare / Node  | Stale-while-revalidate (`swr` route rule, `Cache-Control: s-maxage`).       |

`/_og/**` (OG images cache themselves for 3 days), `/api/**`, `/_sanity/**` and `/preview/**` are never cached by the page rules.

### Vercel

1. Import the repository and set **Root Directory** to `apps/web`. The Nuxt preset is detected automatically.
2. Add the environment variables above.
3. Deploy. ISR and OG images (native renderer, `@takumi-rs/core`) work without extra configuration.

For Visual Editing, add `NUXT_SANITY_API_READ_TOKEN` and `NUXT_SANITY_STUDIO_URL` to the same project and redeploy. Pages stay cached for visitors (see [Visual Editing](#visual-editing)). Then point the Studio's `SANITY_STUDIO_PREVIEW_URL` to the site and add the site to CORS.

### Cloudflare Workers

1. In the Cloudflare dashboard, create a Worker from the Git repository (Workers Builds) with:
   - **Root directory**: `apps/web`
   - **Build command**: `pnpm build`
   - **Deploy command**: `npx wrangler deploy`
   - **Build variables**: the variables above, plus `NITRO_PRESET=cloudflare_module`
2. Add `NUXT_APP_SECRET` as a **secret** of the Worker as well (Settings → Variables and Secrets), since it is also read at runtime.

The build generates the Wrangler config (`.output/server/wrangler.json`) with the `ASSETS` binding that OG images use to load fonts, and Node.js compatibility. OG images use the Wasm renderer (`@takumi-rs/wasm`) and code highlighting uses Shiki's JavaScript engine, so nothing needs WebAssembly compilation at runtime.

To deploy from your machine instead: `NITRO_PRESET=cloudflare_module pnpm --filter web build`, then `npx wrangler --cwd apps/web/.output deploy`.

The Worker is about 2.8 MB gzipped, inside the 3 MB limit of the Workers free plan. Most of it is the OG image renderer.

### Cloudflare Pages

Both modes that prerender work on Pages:

- **Static**: build command `pnpm generate`, output directory `apps/web/.output/public` (or root directory `apps/web` and output `.output/public`).
- **Hybrid**: build variables `NITRO_PRESET=cloudflare_pages` and `NUXT_RENDER_MODE=hybrid`, build command `pnpm build`, output directory `dist` (with root directory `apps/web`). Prerendered pages are served as static files; everything else runs as a Pages Function.

### Other hosts

Any Node.js host works: `pnpm --filter web build`, then `node apps/web/.output/server/index.mjs`.

## Project structure

```
apps/studio
├─ schemaTypes/
│  ├─ documents/      page, collection, entry, author, settings
│  ├─ objects/        link, seo, featureItem, blockContent, pageBuilder
│  ├─ blocks/         one file per page-builder block
│  └─ shared/         reusable field helpers (icon, image, orientation, …)
├─ presentation/      where each document type appears on the site
├─ scripts/seed.ts    example content
├─ structure.ts       Studio menu (Collections → entries)
└─ sanity.config.ts

apps/web
├─ app/
│  ├─ components/
│  │  ├─ blocks/      Block*.vue, one per block
│  │  ├─ PageBlocks.vue     block registry
│  │  ├─ CollectionView.vue collection list page
│  │  ├─ EntryView.vue      entry page
│  │  ├─ EntryList.vue      blog / cards / gallery layouts
│  │  ├─ PortableText.vue   rich text renderer
│  │  ├─ CodeBlock.vue      code block (ProsePre + Shiki)
│  │  ├─ OgImage/           generated social image template
│  │  ├─ ImageGrid.vue      grid + lightbox / slider
│  │  └─ AppImage.vue       responsive Sanity image
│  ├─ composables/    useSanityImage (+ sanityImgProps), usePageSeo
│  ├─ pages/          [...slug].vue resolves every URL
│  ├─ utils/          queries.ts (GROQ), links.ts, entries.ts, format.ts
│  └─ app.vue         header, footer, site-wide SEO
├─ server/api/
│  ├─ highlight.post.ts      Shiki syntax highlighting
│  └─ __sitemap__/urls.ts    sitemap entries from Sanity
└─ sanity.types.ts    generated by `pnpm typegen`
```

## Tech stack

[Nuxt 4](https://nuxt.com) · [Nuxt UI 4](https://ui.nuxt.com) · [Sanity](https://www.sanity.io) · [@nuxtjs/sanity](https://sanity.nuxtjs.org) · [Nuxt Image](https://image.nuxt.com) · [Nuxt SEO](https://nuxtseo.com) · [Shiki](https://shiki.style) · [Tailwind CSS 4](https://tailwindcss.com) · TypeScript
