<script setup lang="ts">
import { GALLERIES_QUERY } from '~/utils/queries'

const { data: galleries } = await useSanityQuery(GALLERIES_QUERY)

usePageSeo({
  title: 'Gallery',
  description: 'Photo collections.'
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Gallery"
      description="Photo collections."
    />

    <UPageBody>
      <UPageGrid v-if="galleries?.length">
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
        description="Create your first gallery in Sanity Studio."
      />
    </UPageBody>
  </UContainer>
</template>
