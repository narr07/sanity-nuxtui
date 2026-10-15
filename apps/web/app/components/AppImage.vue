<script setup lang="ts">
import type { SanityImageValue } from '~/composables/useSanityImage'

// A responsive Sanity image through <NuxtImg> (Sanity is the default provider). A
// pixelated version of the LQIP from the asset metadata shows as a background until
// the image has loaded, without JavaScript and without delaying the real image.
const props = withDefaults(defineProps<{
  image: SanityImageValue
  /** Rendered width in px */
  width?: number
  /** Set together with width to crop to that aspect ratio (uses the hotspot) */
  height?: number
  /** @nuxt/image sizes, e.g. "100vw lg:50vw" */
  sizes?: string
  loading?: 'lazy' | 'eager'
}>(), {
  width: 1200,
  height: undefined,
  sizes: '100vw',
  loading: 'lazy'
})

const cover = computed(() => Boolean(props.height))
const modifiers = computed(() => sanityModifiers(props.image, cover.value))

const height = computed(() => {
  if (props.height) return props.height
  const size = getImageDimensions(props.image.asset?._ref)
  return size ? Math.round(props.width * size.height / size.width) : undefined
})

// The LQIP is a ~20px wide image. Wrapping it in an SVG with
// image-rendering="pixelated" makes the browser scale it up as sharp pixel blocks
// instead of a blur, while the real image on top keeps normal smoothing.
const placeholder = computed(() => {
  const { lqip } = props.image
  if (!lqip) return undefined
  const size = getImageDimensions(props.image.asset?._ref)
  const width = 20
  const height = size ? Math.max(1, Math.round(width * size.height / size.width)) : width
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`
    + `<image href="${lqip}" width="${width}" height="${height}" preserveAspectRatio="none" image-rendering="pixelated" style="image-rendering:pixelated"/></svg>`
  return {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})
</script>

<template>
  <NuxtImg
    v-if="image.asset?._ref"
    :src="image.asset._ref"
    :width="width"
    :height="height"
    :sizes="sizes"
    :fit="cover ? 'cover' : undefined"
    :modifiers="modifiers"
    :alt="image.alt ?? ''"
    :loading="loading"
    :fetchpriority="loading === 'eager' ? 'high' : undefined"
    decoding="async"
    :style="placeholder"
  />
</template>
