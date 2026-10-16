---
title: Installation
description: Create a project from the template, connect it to Sanity and add the example content.
group: Developer guide
order: 301
---

# Installation

## Requirements

- Node.js 24 or later
- A [Sanity](https://www.sanity.io) account (the free plan is enough)
- npm, pnpm, yarn or bun. The commands below use npm; `pnpm dev` works as well as `npm run dev`.

The repository is a workspace with two apps: `studio` (Sanity Studio) and `frontend` (the Nuxt site).

## With the Sanity CLI

The quickest way. One command downloads the template and connects it to a Sanity project:

```sh
npm create sanity@latest -- --template narr07/sanity-nuxtui
```

The CLI asks you to log in, then to create or pick a project and a dataset. It then:

- writes `studio/.env` and `frontend/.env` with the project ID and dataset,
- creates a read token for the live preview and puts it in `frontend/.env`,
- adds `http://localhost:3000` to the CORS origins of the project,
- installs the dependencies with the package manager you choose.

Continue with [Add the example content](#add-the-example-content).

## By hand

### 1. Get the code

```sh
git clone https://github.com/narr07/sanity-nuxtui.git my-site
cd my-site
npm install
```

### 2. Create a Sanity project

Create a project at [sanity.io/manage](https://www.sanity.io/manage) and copy its **project ID**. Or let the CLI do it:

```sh
npm run sanity -- init --bare
```

The template expects a dataset with **public** visibility, the default for new projects.

### 3. Configure the environment

<!-- code-group -->

```sh [Copy]
cp studio/.env.example studio/.env
cp frontend/.env.example frontend/.env
```

```sh [studio/.env]
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

```sh [frontend/.env]
NUXT_SANITY_PROJECT_ID=your-project-id
NUXT_SANITY_DATASET=production
NUXT_SITE_URL=http://localhost:3000
```

<!-- /code-group -->

All variables are described in [Deployment](./deployment.md).

### 4. Log in and allow the site to read content

```sh
npm run sanity -- login
npm run sanity -- cors add http://localhost:3000 --credentials
```

`npm run sanity -- <command>` runs the Sanity CLI inside `studio/`, whatever package manager installed it.

> [!WARNING]
> **Use the same login method every time.** Sanity treats Google, GitHub and email logins as separate accounts. Log in with the one that owns the project.

## Add the example content

```sh
npm run seed
```

This creates the pages, the Blog, Gallery and Projects collections, two authors, these docs and the site settings, with photos from Unsplash. It refuses to run when the dataset already has content; `npm run seed -- --replace` deletes the template's document types first.

## Run

```sh
npm run dev
```

| App | Address |
| --- | --- |
| Site | `http://localhost:3000` |
| Studio | `http://localhost:3333` |

If port 3000 is taken, Nuxt picks the next free port. Update `SANITY_STUDIO_PREVIEW_URL` in `studio/.env` and add that origin to CORS as well.

## Scripts

Run them from the repository root.

| Command | Description |
| --- | --- |
| `npm run dev` | Studio and site together |
| `npm run dev:frontend` / `npm run dev:studio` | One of them |
| `npm run build` | Build both |
| `npm run generate` | Build the site as static files |
| `npm run typegen` | Extract the schema and regenerate `frontend/sanity.types.ts` |
| `npm run seed` | Add the example content (`-- --replace` to start over) |
| `npm run docs:import` | Import the Markdown guides in `docs/` into the Docs collection |
| `npm run deploy:studio` | Deploy the Studio to `<name>.sanity.studio` |
| `npm run sanity -- <command>` | Any Sanity CLI command, run in `studio/` |
| `npm run lint` / `npm run typecheck` | Check the site |
| `npm run validate` | Check the template structure with `@sanity/template-validator` |
