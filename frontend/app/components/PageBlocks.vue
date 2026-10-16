<script setup lang="ts">
import type { Component } from 'vue'
import {
  LazyBlockCallout,
  LazyBlockCardGrid,
  LazyBlockCollectionList,
  LazyBlockCta,
  LazyBlockFaq,
  LazyBlockHero,
  LazyBlockImageGallery,
  LazyBlockLogos,
  LazyBlockPricing,
  LazyBlockRichText,
  LazyBlockSection,
  LazyBlockTestimonials,
  LazyBlockTimeline
} from '#components'
import type { BlockType, PageBlock } from '~/types/sanity'

const props = withDefaults(defineProps<{
  blocks: PageBlock[] | null | undefined
  /** From useSanityQuery; makes blocks clickable and sortable in the Presentation tool.
   * Takes a path in the query result (array indexes), not a document path (_key). */
  encodeDataAttribute?: (path: (string | number)[]) => unknown
  /** Where `blocks` sits in the query result, e.g. ['page'] */
  basePath?: string[]
}>(), {
  basePath: () => []
})

// Sanity `_type` → Vue component. Typing it as Record<BlockType, …> makes
// TypeScript fail when a block exists in the schema without a component here.
const registry: Record<BlockType, Component> = {
  hero: LazyBlockHero,
  logos: LazyBlockLogos,
  section: LazyBlockSection,
  cardGrid: LazyBlockCardGrid,
  timeline: LazyBlockTimeline,
  imageGallery: LazyBlockImageGallery,
  richText: LazyBlockRichText,
  testimonials: LazyBlockTestimonials,
  faq: LazyBlockFaq,
  pricing: LazyBlockPricing,
  cta: LazyBlockCta,
  callout: LazyBlockCallout,
  collectionList: LazyBlockCollectionList
}

const isDev = import.meta.dev

// Visual Editing: the content source map only maps leaf values, so encode the
// block's _key and trim it off. The attribute then points at the array item,
// which makes blocks clickable and reorderable in the Presentation tool.
function blockDataAttribute(index: number) {
  const value = props.encodeDataAttribute?.([...props.basePath, 'blocks', index, '_key'])
  return typeof value === 'string' ? value.replace(/(path=[^;]*)\._key(?=;|$)/, '$1') : undefined
}
</script>

<template>
  <div
    v-for="(block, index) in blocks ?? []"
    :key="block._key"
    :data-sanity="blockDataAttribute(index)"
  >
    <component
      :is="registry[block._type]"
      v-if="registry[block._type]"
      :block="block"
      :index="index"
    />
    <UContainer
      v-else-if="isDev"
      class="py-8"
    >
      <UAlert
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :title="`Block '${(block as { _type: string })._type}' has no component`"
        description="Create it in app/components/blocks/ and register it in PageBlocks.vue."
      />
    </UContainer>
  </div>
</template>
