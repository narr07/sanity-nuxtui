<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'imageGallery'>
  index: number
}>()
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :title="block.title"
    :description="block.description"
    :ui="sectionUi"
  >
    <template
      v-if="block.headline"
      #headline
    >
      <SectionLabel
        :text="block.headline"
        :index="index"
      />
    </template>

    <ImageGrid
      :images="block.images"
      :layout="stegaClean(block.layout) ?? 'grid'"
    />
  </UPageSection>
</template>
