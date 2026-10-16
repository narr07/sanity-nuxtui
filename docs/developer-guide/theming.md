---
title: Theming
description: Colors, fonts, component styles and the motion utilities of the Swiss theme.
group: Developer guide
order: 306
---

# Theming

The template ships a Swiss-style theme: a strict grid, large tight headings, square corners and one red accent. Everything is set in two files.

## Colors

`apps/web/app/app.config.ts` maps Nuxt UI's semantic colors to palettes:

```ts [apps/web/app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'swiss',
      neutral: 'mauve'
    }
  }
})
```

`swiss` is a custom scale defined in `app/assets/css/main.css` with `@theme`; `mauve` comes with Tailwind. Swap them for any Tailwind palette or your own scale. Components use semantic classes such as `text-muted`, `bg-elevated` and `border-default`, so light and dark mode follow automatically.

## Fonts

Fonts load through `@nuxt/fonts`, configured in `nuxt.config.ts` under `fonts.families`: **Funnel Display** for headings, **Funnel Sans** for text and **JetBrains Mono** for code. `main.css` assigns them to `--font-heading`, `--font-sans` and `--font-mono`.

Fonts registered with `global: true` are also available to the generated social images.

## Component styles

`app.config.ts` also restyles Nuxt UI components globally: the hero and section sizes, the 12-column header layout of sections, the press effect of buttons, accordion spacing. Each entry overrides the slots of a component's theme; see the [Nuxt UI theme docs](https://ui.nuxt.com/docs/getting-started/theme). Per instance, pass the `ui` prop instead.

The corner radius is set once, with `--ui-radius: 0rem` in `main.css`.

## Motion

Animations use CSS scroll-driven animations: no JavaScript, and they run off the main thread. Visitors who prefer reduced motion, and browsers without support, get the content without animation. These utilities live in `main.css`:

| Utility | Effect |
| --- | --- |
| `reveal` | Fades and rises as it scrolls into view. Set `--reveal-index` (or use `revealIndex()`) to stagger items in a row |
| `reveal-wipe` | Uncovers an image from the top |
| `parallax` | A slow vertical drift for images inside an `overflow-hidden` frame |
| `intro`, `intro-mask` | Plays once on page load, for the first block. `--intro-index` staggers |
| `scroll-progress` | The reading progress line on entries |
| `link-underline` | An underline that draws in on hover |

Page transitions are a short fade, set in `nuxt.config.ts` (`app.pageTransition`) with styles in `main.css`.

## Social images

The generated social image is a Vue component, `app/components/OgImage/Page.takumi.vue`. Its colors mirror the theme; update them when you change the palette.
