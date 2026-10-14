<script setup lang="ts">
import type { SanityImageSource } from '@sanity/image-url'

const props = withDefaults(defineProps<{
  image: SanityImageSource & { asset?: { _ref?: string }, alt?: string | null }
  /** Maximum rendered width in px, used to build the srcset */
  width?: number
  sizes?: string
  loading?: 'lazy' | 'eager'
}>(), {
  width: 1200,
  sizes: '100vw',
  loading: 'lazy'
})

const urlFor = useSanityImage()

const dimensions = computed(() => getImageDimensions(props.image.asset?._ref))

const widths = computed(() => {
  const max = Math.min(props.width * 2, dimensions.value?.width ?? Infinity)
  return [320, 640, 960, 1280, 1920, 2560].filter(w => w < max).concat(max === Infinity ? [] : [max])
})

const src = computed(() => urlFor(props.image).width(props.width).url())
const srcset = computed(() => widths.value.map(w => `${urlFor(props.image).width(w).url()} ${w}w`).join(', '))

const height = computed(() => dimensions.value
  ? Math.round(props.width * dimensions.value.height / dimensions.value.width)
  : undefined
)
</script>

<template>
  <img
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :width="width"
    :height="height"
    :alt="image.alt ?? ''"
    :loading="loading"
    decoding="async"
  >
</template>
