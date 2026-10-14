<script setup lang="ts">
import type { Component } from 'vue'
import {
  LazyBlockCallout,
  LazyBlockCardGrid,
  LazyBlockCta,
  LazyBlockFaq,
  LazyBlockGalleryList,
  LazyBlockHero,
  LazyBlockImageGallery,
  LazyBlockLogos,
  LazyBlockPostList,
  LazyBlockPricing,
  LazyBlockRichText,
  LazyBlockSection,
  LazyBlockTestimonials,
  LazyBlockTimeline
} from '#components'
import type { BlockType, PageBlock } from '~/types/sanity'

defineProps<{
  blocks: PageBlock[] | null | undefined
  /** From useSanityQuery; makes blocks clickable and sortable in the Presentation tool */
  encodeDataAttribute?: (path: (string | number | { _key: string })[]) => unknown
}>()

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
  postList: LazyBlockPostList,
  galleryList: LazyBlockGalleryList
}

const isDev = import.meta.dev
</script>

<template>
  <div
    v-for="(block, index) in blocks ?? []"
    :key="block._key"
    :data-sanity="encodeDataAttribute?.(['blocks', { _key: block._key }])"
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
