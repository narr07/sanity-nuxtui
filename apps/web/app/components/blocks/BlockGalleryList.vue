<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'galleryList'>
  index: number
}>()

const galleries = computed(() => (props.block.galleries ?? []).slice(0, props.block.limit ?? 3))
const viewAll = computed(() => toButton(props.block.link))
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UPageGrid v-if="galleries.length">
      <GalleryCard
        v-for="gallery in galleries"
        :key="gallery._id"
        :gallery="gallery"
      />
    </UPageGrid>
    <UEmpty
      v-else
      icon="i-lucide-images"
      title="No galleries yet"
      description="Published galleries will show up here."
    />

    <div
      v-if="viewAll?.label"
      class="flex justify-center"
    >
      <UButton
        v-bind="viewAll"
        size="lg"
      />
    </div>
  </UPageSection>
</template>
