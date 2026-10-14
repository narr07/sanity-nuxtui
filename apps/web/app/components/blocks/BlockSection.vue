<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'section'>
  index: number
}>()

const features = computed(() => props.block.features?.map(feature => ({
  title: feature.title,
  description: feature.description,
  icon: stegaClean(feature.icon)
})))
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :icon="stegaClean(block.icon)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
    :links="toButtons(block.links)"
    :features="features"
    :orientation="stegaClean(block.orientation) ?? 'vertical'"
    :reverse="block.reverse"
  >
    <template
      v-if="block.image?.asset"
      #default
    >
      <AppImage
        :image="block.image"
        :width="720"
        sizes="(min-width: 1024px) 50vw, 100vw"
        class="h-auto w-full rounded-lg ring ring-default"
      />
    </template>
  </UPageSection>
</template>
