<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import { GALLERY_QUERY } from '~/utils/queries'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: gallery } = await useSanityQuery(GALLERY_QUERY, { slug })

if (!gallery.value) {
  throw createError({ statusCode: 404, statusMessage: 'Gallery not found', fatal: true })
}

usePageSeo(() => ({
  title: gallery.value?.seo?.title || gallery.value?.title,
  description: gallery.value?.seo?.description || gallery.value?.description,
  image: gallery.value?.seo?.image ?? gallery.value?.images?.[0],
  noIndex: gallery.value?.seo?.noIndex
}))
</script>

<template>
  <UContainer v-if="gallery">
    <UPageHeader
      :title="gallery.title"
      :description="gallery.description ?? undefined"
    >
      <template #headline>
        <UButton
          to="/gallery"
          icon="i-lucide-arrow-left"
          label="Gallery"
          color="neutral"
          variant="link"
          class="-ms-1.5 p-0"
        />
        <span class="text-muted">·</span>
        <span class="text-muted">{{ gallery.images?.length ?? 0 }} photos</span>
        <template v-if="gallery.date">
          <span class="text-muted">·</span>
          <time
            :datetime="stegaClean(gallery.date)"
            class="text-muted"
          >{{ formatDate(gallery.date) }}</time>
        </template>
      </template>
    </UPageHeader>

    <UPageBody>
      <ImageGrid :images="gallery.images" />
    </UPageBody>
  </UContainer>
</template>
