# Sanity × Nuxt UI

A block-based website builder. Editors compose pages from blocks in **Sanity Studio**; the **Nuxt** site renders every block with **Nuxt UI** components.

- **14 page-builder blocks**: hero, features, card grid, timeline, image gallery, rich text, testimonials, FAQ, pricing, call to action, callout, logo cloud, latest posts and latest galleries
- **Blog**: posts with authors, tags, cover images, rich text, related posts and tag filtering
- **Galleries**: bulk photo upload, grid with a lightbox
- **Site settings**: logo, navigation, header buttons, footer columns and social links, all editable
- **Visual Editing**: click any text in the Presentation tool to edit it, with live draft preview
- **SEO** with [Nuxt SEO](https://nuxtseo.com): sitemap from your content, robots.txt, social images, schema.org
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

Creates site settings, Home/About/Pricing/Contact pages, four blog posts, two authors and three galleries, with photos from [Unsplash](https://unsplash.com) via picsum.photos. It stops if the dataset already has content; `pnpm seed --replace` deletes existing pages, posts, authors, galleries and settings first.

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

| Type      | Studio menu   | URL               | Rendered by                          |
| --------- | ------------- | ----------------- | ------------------------------------ |
| `page`    | Pages         | `/<slug>`         | `app/pages/[...slug].vue` + blocks   |
| `post`    | Blog → Posts  | `/blog/<slug>`    | `app/pages/blog/[slug].vue`          |
| `author`  | Blog → Authors| —                 | Shown on posts                       |
| `gallery` | Galleries     | `/gallery/<slug>` | `app/pages/gallery/[slug].vue`       |
| `settings`| Site Settings | every page        | `app/app.vue` (header, footer, SEO)  |

- The page with slug `home` is the homepage (`/`). Nested slugs like `company/team` work.
- `/blog` and `/gallery` list all posts and galleries. `/blog?tag=guide` filters by tag.
- Pages are flexible (built from blocks). Posts and galleries have a fixed structure and share one template each.

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
| Latest Posts       | `UBlogPosts`, `UBlogPost`                       | `post-list.ts`                             | `BlockPostList.vue`                           |
| Latest Galleries   | `UPageGrid`, `UPageCard`                        | `gallery-list.ts`                          | `BlockGalleryList.vue`                        |

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

The `link` object (buttons, navigation, footer) points to a page, post or gallery, or to any URL, anchor (`#faq`), route (`/blog`) or `mailto:`. The `LINK` projection in `queries.ts` resolves references to paths, so components only see a `to` string.

## Visual Editing

1. Create a token with the **Viewer** role at sanity.io/manage → API → Tokens.
2. Set `NUXT_SANITY_API_READ_TOKEN` in `apps/web/.env` and restart the site.
3. Open **Presentation** in Studio.

Click any text to open its field, and drag blocks in the preview to reorder them. Drafts appear as you type. The token is only used server-side.

## SEO

Configured in `apps/web/nuxt.config.ts` with [`@nuxtjs/seo`](https://nuxtseo.com).

- **Site URL and name**: set `NUXT_SITE_URL` (your production domain) and `NUXT_SITE_NAME`.
- **Meta tags**: every document has an SEO tab (title, description, social image, *Hide from search engines*). Empty fields fall back to the title, excerpt or cover image, then to the defaults in Site Settings. See `app/composables/usePageSeo.ts`.
- **Sitemap**: `/sitemap.xml` includes every page, post and gallery not hidden from search engines (`server/api/__sitemap__/urls.ts`).
- **robots.txt**: generated automatically; indexing is blocked outside production.
- **Structured data**: posts output schema.org `Article` with authors.
- **Social images** come from Sanity and are cropped to 1200 × 630. Dynamic OG image generation is disabled (`ogImage.enabled: false`); enable it if you want generated images.

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
| `pnpm typegen`          | Extract the schema and regenerate `apps/web/sanity.types.ts`  |
| `pnpm seed`             | Add example content (`--replace` to start over)               |
| `pnpm deploy:studio`    | Deploy Studio to `<name>.sanity.studio`                       |
| `pnpm lint`             | ESLint for the site                                           |
| `pnpm typecheck`        | Type-check the site                                           |

## Deployment

**Studio**: `pnpm deploy:studio` hosts it on Sanity. Or build it with `pnpm --filter studio build` and serve `apps/studio/dist` anywhere.

**Site**: deploy `apps/web` to any Node or serverless host (Vercel, Netlify, Cloudflare, …). On monorepo-aware hosts, set the root directory to `apps/web`. Environment variables:

| Variable                     | Required | Purpose                                   |
| ---------------------------- | -------- | ----------------------------------------- |
| `NUXT_SANITY_PROJECT_ID`     | yes      | Sanity project ID                         |
| `NUXT_SANITY_DATASET`        | yes      | Dataset, usually `production`             |
| `NUXT_SITE_URL`              | yes      | Public URL, e.g. `https://example.com`    |
| `NUXT_SITE_NAME`             | no       | Fallback site name                        |
| `NUXT_SANITY_API_READ_TOKEN` | no       | Enables Visual Editing                    |
| `NUXT_SANITY_STUDIO_URL`     | no       | Studio URL, for Visual Editing overlays   |

After deploying, add the site URL to CORS (`sanity cors add https://example.com --credentials`) and set `SANITY_STUDIO_PREVIEW_URL` for the Studio to the same URL.

## Project structure

```
apps/studio
├─ schemaTypes/
│  ├─ documents/      page, post, author, gallery, settings
│  ├─ objects/        link, seo, featureItem, blockContent, pageBuilder
│  ├─ blocks/         one file per page-builder block
│  └─ shared/         reusable field helpers (icon, image, orientation, …)
├─ presentation/      where each document type appears on the site
├─ scripts/seed.ts    example content
├─ structure.ts       Studio menu
└─ sanity.config.ts

apps/web
├─ app/
│  ├─ components/
│  │  ├─ blocks/      Block*.vue, one per block
│  │  ├─ PageBlocks.vue   block registry
│  │  ├─ PortableText.vue rich text renderer
│  │  ├─ ImageGrid.vue    grid + lightbox / slider
│  │  └─ AppImage.vue     responsive Sanity image
│  ├─ composables/    useSanityImage, usePageSeo, useBlogPostProps
│  ├─ pages/          [...slug].vue, blog/, gallery/
│  ├─ utils/          queries.ts (GROQ), links.ts, format.ts
│  └─ app.vue         header, footer, site-wide SEO
├─ server/api/__sitemap__/urls.ts
└─ sanity.types.ts    generated by `pnpm typegen`
```

## Tech stack

[Nuxt 4](https://nuxt.com) · [Nuxt UI 4](https://ui.nuxt.com) · [Sanity](https://www.sanity.io) · [@nuxtjs/sanity](https://sanity.nuxtjs.org) · [Nuxt SEO](https://nuxtseo.com) · [Tailwind CSS 4](https://tailwindcss.com) · TypeScript
