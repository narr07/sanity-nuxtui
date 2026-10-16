---
title: Adding a block
description: Turn any Nuxt UI component into a block editors can use, in five steps.
group: Developer guide
order: 304
---

# Adding a block

A block is a schema in the Studio and a component on the site, connected by its `_type`. This guide adds a **Stats** block: a title and a row of numbers with labels.

## 1. Schema

Create `apps/studio/schemaTypes/blocks/stats.ts`. Name fields after the props of the Nuxt UI component you will use: the component can then pass values straight through, and the Nuxt UI docs double as field documentation.

```ts [apps/studio/schemaTypes/blocks/stats.ts]
import { defineArrayMember, defineField, defineType } from 'sanity'
import { ActivityIcon } from '@sanity/icons/Activity'
import { anchorField, headerFields } from '../shared/fields'

export const stats = defineType({
  name: 'stats',
  title: 'Stats',
  type: 'object',
  icon: ActivityIcon,
  fields: [
    ...headerFields,
    defineField({
      name: 'items',
      title: 'Numbers',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'value', title: 'Value', type: 'string' }),
          defineField({ name: 'label', title: 'Label', type: 'string' })
        ]
      })]
    }),
    anchorField
  ]
})
```

`headerFields` adds the headline, title and description every section block has.

## 2. Register the schema

Add the type to `schemaTypes/index.ts`, then to the page builder in `schemaTypes/objects/page-builder.ts`, including a group of the insert menu:

```ts [apps/studio/schemaTypes/objects/page-builder.ts]
of: [
  // …
  defineArrayMember({ type: 'stats' })
],
options: {
  insertMenu: {
    groups: [
      { name: 'content', title: 'Content', of: ['section', 'cardGrid', 'timeline', 'imageGallery', 'richText', 'stats'] },
      // …
    ]
  }
}
```

## 3. Generate the types

```sh
pnpm typegen
```

The block is now part of `PageBlock` in `apps/web/sanity.types.ts`, and `BlockOf<'stats'>` gives its exact type.

> [!NOTE]
> **Blocks with references need a projection.** When a block links to documents or uses images, add a branch for it in `BLOCKS` in `apps/web/app/utils/queries.ts` (see how `cardGrid` resolves `link` and `image`). Plain fields like the ones above come through `...` automatically.

## 4. Component

Create `apps/web/app/components/blocks/BlockStats.vue`. Follow the pattern of the existing blocks: `SectionLabel` for the headline, `sectionUi` for the scroll-in animation, and `revealIndex()` to stagger items in a row.

```vue [apps/web/app/components/blocks/BlockStats.vue]
<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{ block: BlockOf<'stats'>, index: number }>()
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :title="block.title"
    :description="block.description"
    :ui="sectionUi"
  >
    <template v-if="block.headline" #headline>
      <SectionLabel :text="block.headline" :index="index" />
    </template>

    <UPageGrid>
      <UPageCard
        v-for="(item, itemIndex) in block.items"
        :key="item._key"
        :title="item.value"
        :description="item.label"
        class="reveal"
        :style="revealIndex(itemIndex)"
      />
    </UPageGrid>
  </UPageSection>
</template>
```

## 5. Register the component

Add it to the registry in `apps/web/app/components/PageBlocks.vue`:

```ts [apps/web/app/components/PageBlocks.vue]
const registry: Record<BlockType, Component> = {
  hero: LazyBlockHero,
  // …
  stats: LazyBlockStats
}
```

The registry is typed as `Record<BlockType, Component>`, so `pnpm typecheck` fails until every block in the schema has a component. In development, a block without a component shows a warning on the page instead of breaking it.

## Clean values that drive logic

During Visual Editing, strings carry invisible markers (stega) so the Presentation tool knows which field each text comes from. Text displays fine with them, but values used as logic break: icon names, colors, variants, URLs, anchors, class names. Wrap those in `stegaClean()`, as `:id="stegaClean(block.anchor)"` does above. `toButton()` and `toButtons()` in `app/utils/links.ts` do it for links.
