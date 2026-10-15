<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'logos'>
  index: number
}>()

// UPageLogos accepts an icon name (string) or { src, alt }
const items = computed(() => props.block.items?.map((item) => {
  const image = sanityImgProps(item.image, { alt: item.image?.alt || item.name })
  if (image) return { src: image.src, alt: image.alt }
  return stegaClean(item.icon) ?? ''
}).filter(Boolean))
</script>

<template>
  <UContainer class="border-t border-default py-12 sm:py-16">
    <UPageLogos
      class="reveal"
      :title="block.title"
      :items="items"
      :marquee="block.marquee"
    />
  </UContainer>
</template>
