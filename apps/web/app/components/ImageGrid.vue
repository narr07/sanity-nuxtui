<script setup lang="ts">
import type { SanityImageSource } from '@sanity/image-url'

type GalleryImage = SanityImageSource & {
  _key: string
  asset?: { _ref?: string }
  alt?: string | null
  caption?: string | null
}

const props = withDefaults(defineProps<{
  images: GalleryImage[] | null | undefined
  /** grid: thumbnails that open a lightbox. carousel: a full-width slider. */
  layout?: 'grid' | 'carousel'
}>(), {
  layout: 'grid'
})

const urlFor = useSanityImage()
const items = computed(() => (props.images ?? []).filter(image => image.asset))

const open = ref(false)
const startIndex = ref(0)

function show(index: number) {
  startIndex.value = index
  open.value = true
}
</script>

<template>
  <UCarousel
    v-if="layout === 'carousel'"
    v-slot="{ item }"
    :items="items"
    arrows
    dots
    loop
    class="w-full"
    :ui="{ item: 'basis-full', container: 'items-center' }"
  >
    <figure>
      <AppImage
        :image="item"
        :width="1280"
        sizes="(min-width: 1280px) 1280px, 100vw"
        class="h-auto max-h-[70vh] w-full rounded-lg object-contain"
      />
      <figcaption
        v-if="item.caption"
        class="mt-2 text-center text-sm text-muted"
      >
        {{ item.caption }}
      </figcaption>
    </figure>
  </UCarousel>

  <template v-else>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <button
        v-for="(image, index) in items"
        :key="image._key"
        type="button"
        class="group relative aspect-square overflow-hidden rounded-lg bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
        :aria-label="`Open image ${index + 1}${image.alt ? `: ${image.alt}` : ''}`"
        @click="show(index)"
      >
        <img
          :src="urlFor(image).width(600).height(600).url()"
          :alt="image.alt ?? ''"
          width="600"
          height="600"
          loading="lazy"
          decoding="async"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        >
      </button>
    </div>

    <UModal
      v-model:open="open"
      title="Gallery"
      fullscreen
      :ui="{ body: 'flex items-center sm:p-6' }"
    >
      <template #body>
        <UCarousel
          v-slot="{ item }"
          :items="items"
          :start-index="startIndex"
          arrows
          loop
          class="w-full"
          :ui="{ item: 'basis-full', container: 'items-center' }"
        >
          <figure class="flex flex-col items-center">
            <AppImage
              :image="item"
              :width="1600"
              sizes="100vw"
              class="h-auto max-h-[78vh] w-auto rounded-lg object-contain"
            />
            <figcaption
              v-if="item.caption || item.alt"
              class="mt-3 text-center text-sm text-muted"
            >
              {{ item.caption || item.alt }}
            </figcaption>
          </figure>
        </UCarousel>
      </template>
    </UModal>
  </template>
</template>
