<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { GalleryCard } from '~/types/sanity'

defineProps<{
  gallery: GalleryCard
}>()
</script>

<template>
  <UPageCard
    :title="gallery.title"
    :description="gallery.description ?? undefined"
    :to="`/gallery/${stegaClean(gallery.slug)}`"
    variant="subtle"
    reverse
    :ui="{ container: 'lg:items-start' }"
  >
    <AppImage
      v-if="gallery.cover?.asset"
      :image="gallery.cover"
      :width="640"
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      class="aspect-[4/3] h-auto w-full rounded-md object-cover"
    />
    <template #footer>
      <p class="text-sm text-muted">
        {{ gallery.count }} photos<template v-if="gallery.date">
          · {{ formatDate(gallery.date) }}
        </template>
      </p>
    </template>
  </UPageCard>
</template>
