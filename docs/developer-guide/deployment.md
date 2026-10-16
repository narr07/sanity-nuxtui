---
title: Deployment
description: Host the Studio on Sanity and the site on Vercel, Cloudflare or any Node server.
group: Developer guide
order: 312
---

# Deployment

The Studio and the site deploy separately. Content changes never need a deploy; code changes do.

## Studio

```sh
pnpm --filter studio exec sanity deploy --url your-name
```

The first deploy publishes the Studio at `https://your-name.sanity.studio` and prints an app ID. Put it in `SANITY_STUDIO_APP_ID` in `apps/studio/.env`, so `pnpm deploy:studio` updates the same Studio afterwards. Then allow the Studio in CORS:

```sh
pnpm --filter studio exec sanity cors add https://your-name.sanity.studio --credentials
```

`SANITY_STUDIO_*` variables are built into the Studio, so redeploy after changing them. Put production values, such as the site address for the preview, in `apps/studio/.env.production`.

To host the Studio yourself, run `pnpm --filter studio build` and serve `apps/studio/dist`.

## Environment variables (site)

Set them as build variables: the project ID and site URL are read at build time.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NUXT_SANITY_PROJECT_ID` | yes | Sanity project ID |
| `NUXT_SANITY_DATASET` | yes | Dataset, usually `production` |
| `NUXT_SITE_URL` | yes | Public URL, e.g. `https://example.com` |
| `NUXT_APP_SECRET` | yes | Signs social image URLs. `npx nuxt-og-image generate-secret` |
| `NUXT_SITE_NAME` | no | Fallback site name |
| `NUXT_CACHE_TTL` | no | Seconds before a cached page refreshes. Default `60`; `0` turns caching off |
| `NUXT_RENDER_MODE` | no | `ssr` (default), `hybrid` or `static` |
| `NUXT_SANITY_API_READ_TOKEN` | no | Enables Visual Editing |
| `NUXT_SANITY_STUDIO_URL` | no | The Studio address, for Visual Editing |

After deploying, add the site to CORS (`sanity cors add https://example.com --credentials`) for search and Visual Editing.

## Vercel

1. Import the repository and set **Root Directory** to `apps/web`. The Nuxt preset is detected.
2. Add the environment variables.
3. Deploy. ISR and social images work without further setup.

For Visual Editing, add the read token and the Studio URL to the same project and redeploy; pages stay cached for visitors.

## Cloudflare Workers

1. In the Cloudflare dashboard, create a Worker from the Git repository with:
   - **Root directory**: `apps/web`
   - **Build command**: `pnpm build`
   - **Deploy command**: `npx wrangler deploy`
   - **Build variables**: the variables above, plus `NITRO_PRESET=cloudflare_module`
2. Add `NUXT_APP_SECRET` as a **secret** of the Worker too, since it is read at runtime.

The build generates the Wrangler config with the bindings social images need. The Worker is about 2.8 MB gzipped, inside the 3 MB limit of the free plan.

To deploy from your machine: `NITRO_PRESET=cloudflare_module pnpm --filter web build`, then `npx wrangler --cwd apps/web/.output deploy`.

## Cloudflare Pages

- **Static**: build command `pnpm generate`, output directory `apps/web/.output/public`.
- **Hybrid**: build variables `NITRO_PRESET=cloudflare_pages` and `NUXT_RENDER_MODE=hybrid`, build command `pnpm build`, root directory `apps/web`, output directory `dist`.

## Any Node host

```sh
pnpm --filter web build
node apps/web/.output/server/index.mjs
```
