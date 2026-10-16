<script setup lang="ts">
import type { SanityImageValue } from '~/composables/useSanityImage'

type GalleryImage = SanityImageValue & {
  _key: string
  caption?: string | null
}

const props = withDefaults(defineProps<{
  images: GalleryImage[] | null | undefined
  /** grid: thumbnails that open a lightbox. carousel: a full-width slider. */
  layout?: 'grid' | 'carousel'
}>(), {
  layout: 'grid'
})

const items = computed(() => (props.images ?? []).filter(image => image.asset))
const t = useLabels()

// 1–3 photos fill the row instead of leaving empty columns
const gridClass = computed(() => {
  const count = items.value.length
  if (count === 1) return 'grid-cols-1 max-w-3xl'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-2 sm:grid-cols-3'
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
})

// Arrows and dots sit in a row under the slides, inside the container. The
// default arrows hang outside the carousel and push the page wider than the screen.
const carouselUi = {
  controls: 'mt-6 flex items-center justify-between gap-6',
  arrows: 'order-last flex gap-2',
  prev: 'static translate-y-0 rounded-none',
  next: 'static translate-y-0 rounded-none',
  dots: 'static inset-auto justify-start gap-2',
  dot: 'h-0.5 w-8 rounded-none'
}

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
    class="reveal min-w-0"
    :ui="{ ...carouselUi, item: items.length > 1 ? 'basis-full sm:basis-1/2' : 'basis-full' }"
  >
    <figure>
      <div class="overflow-hidden bg-elevated">
        <AppImage
          :image="item"
          :width="960"
          :height="640"
          sizes="100vw sm:50vw xl:640px"
          class="aspect-[3/2] h-auto w-full object-cover"
        />
      </div>
      <figcaption
        v-if="item.caption"
        class="mt-3 text-sm text-muted"
      >
        {{ item.caption }}
      </figcaption>
    </figure>
  </UCarousel>

  <template v-else>
    <div
      class="grid gap-3"
      :class="gridClass"
    >
      <button
        v-for="(image, index) in items"
        :key="image._key"
        type="button"
        :style="revealIndex(index, 4)"
        class="reveal group relative aspect-square overflow-hidden bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
        :aria-label="`${t('openImage', { number: index + 1 })}${image.alt ? `: ${image.alt}` : ''}`"
        @click="show(index)"
      >
        <AppImage
          :image="image"
          :width="600"
          :height="600"
          sizes="50vw sm:33vw lg:25vw"
          class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </button>
    </div>

    <UModal
      v-model:open="open"
      :title="t('gallery')"
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
          class="min-w-0 w-full"
          :ui="{ ...carouselUi, item: 'basis-full', container: 'items-center', controls: 'mt-4 flex justify-center', arrows: 'flex gap-2' }"
        >
          <figure class="flex flex-col items-center">
            <AppImage
              :image="item"
              :width="1600"
              sizes="100vw"
              class="h-auto max-h-[78vh] w-auto object-contain"
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
