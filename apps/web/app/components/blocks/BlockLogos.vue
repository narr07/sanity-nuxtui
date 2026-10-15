<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'logos'>
  index: number
}>()

const urlFor = useSanityImage()

// UPageLogos menerima nama ikon (string) atau { src, alt }
const items = computed(() => props.block.items?.map((item) => {
  if (item.image?.asset) {
    return { src: urlFor(item.image).height(80).url(), alt: item.image.alt || item.name }
  }
  return stegaClean(item.icon) ?? ''
}).filter(Boolean))
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <UPageLogos
      :title="block.title"
      :items="items"
      :marquee="block.marquee"
    />
  </UContainer>
</template>
