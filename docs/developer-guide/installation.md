---
title: Installation
description: Set up the template locally, connect it to a Sanity project and add the example content.
group: Developer guide
order: 301
---

# Installation

## Requirements

- Node.js 24 or later
- pnpm
- A [Sanity](https://www.sanity.io) account (the free plan is enough)

## 1. Get the code

```sh
git clone https://github.com/narr07/sanity-nuxtui.git my-site
cd my-site
pnpm install
```

The repository is a pnpm workspace with two apps: `apps/studio` (Sanity Studio) and `apps/web` (the Nuxt site).

## 2. Create a Sanity project

Create a project at [sanity.io/manage](https://www.sanity.io/manage) and copy its **project ID**. Or let the CLI do it:

```sh
pnpm --filter studio exec sanity init --bare
```

The template expects a dataset called `production` with **public** visibility, the default for new projects.

## 3. Configure the environment

<!-- code-group -->

```sh [Copy]
cp apps/studio/.env.example apps/studio/.env
cp apps/web/.env.example apps/web/.env
```

```sh [apps/studio/.env]
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

```sh [apps/web/.env]
NUXT_SANITY_PROJECT_ID=your-project-id
NUXT_SANITY_DATASET=production
NUXT_SITE_URL=http://localhost:3000
```

<!-- /code-group -->

All variables are described in [Deployment](./deployment.md).

## 4. Log in and allow the site to read content

```sh
pnpm --filter studio exec sanity login
pnpm --filter studio exec sanity cors add http://localhost:3000 --credentials
```

> [!WARNING]
> **Use the same login method every time.** Sanity treats Google, GitHub and email logins as separate accounts. Log in with the one that owns the project.

## 5. Add the example content

```sh
pnpm seed
```

This creates the pages, the Blog, Gallery and Projects collections, two authors, these docs and the site settings, with photos from Unsplash. It refuses to run when the dataset already has content; `pnpm seed --replace` deletes the template's document types first.

## 6. Run

```sh
pnpm dev
```

| App | Address |
| --- | --- |
| Site | `http://localhost:3000` |
| Studio | `http://localhost:3333` |

If port 3000 is taken, Nuxt picks the next free port. Update `SANITY_STUDIO_PREVIEW_URL` in `apps/studio/.env` and add that origin to CORS as well.

## Scripts

Run them from the repository root.

| Command | Description |
| --- | --- |
| `pnpm dev` | Studio and site together |
| `pnpm dev:web` / `pnpm dev:studio` | One of them |
| `pnpm build` | Build both |
| `pnpm generate` | Build the site as static files |
| `pnpm typegen` | Extract the schema and regenerate `apps/web/sanity.types.ts` |
| `pnpm seed` | Add the example content (`--replace` to start over) |
| `pnpm docs:import` | Import the Markdown guides in `docs/` into the Docs collection |
| `pnpm deploy:studio` | Deploy the Studio to `<name>.sanity.studio` |
| `pnpm lint` / `pnpm typecheck` | Check the site |
