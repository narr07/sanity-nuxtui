import type { ImageModifiers } from '@nuxt/image'

export interface SanityImageValue {
  asset?: { _ref?: string } | null
  crop?: { top?: number, bottom?: number, left?: number, right?: number } | null
  hotspot?: { x?: number, y?: number } | null
  alt?: string | null
  /** Low-quality placeholder from the asset metadata (see IMAGE in queries.ts) */
  lqip?: string | null
}

// Asset refs look like "image-<id>-<width>x<height>-<ext>", so the dimensions can be
// read without an extra query. Used for width/height attributes to avoid layout shift.
export function getImageDimensions(ref?: string | null) {
  const match = ref?.match(/-(\d+)x(\d+)-/)
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined
}

// The crop and hotspot set in the Studio, as @nuxt/image Sanity modifiers. `rect`
// applies the crop; the hotspot becomes the focal point when the image is cropped
// to a different aspect ratio (fit: cover).
export function sanityModifiers(image: SanityImageValue, cover = false): Partial<ImageModifiers> {
  const modifiers: Record<string, string | number> = {}
  const size = getImageDimensions(image.asset?._ref)
  const { crop, hotspot } = image

  if (crop && size) {
    const left = (crop.left ?? 0) * size.width
    const top = (crop.top ?? 0) * size.height
    const width = size.width - left - (crop.right ?? 0) * size.width
    const height = size.height - top - (crop.bottom ?? 0) * size.height
    modifiers.rect = [left, top, width, height].map(Math.round).join(',')
  }

  if (cover && hotspot?.x != null && hotspot.y != null) {
    modifiers.crop = 'focalpoint'
    modifiers['fp-x'] = Number(hotspot.x.toFixed(3))
    modifiers['fp-y'] = Number(hotspot.y.toFixed(3))
  }

  return modifiers
}

// Props for Nuxt UI components that render <NuxtImg> themselves (UBlogPost `image`,
// UAvatar / UUser `avatar`). They get the asset ref instead of a finished URL, so the
// Sanity provider builds a responsive URL with the Studio crop and hotspot.
export function sanityImgProps(
  image: SanityImageValue | null | undefined,
  options: { width?: number, height?: number, sizes?: string, alt?: string } = {}
) {
  const ref = image?.asset?._ref
  if (!ref) return undefined
  const cover = Boolean(options.width && options.height)
  return {
    src: ref,
    alt: options.alt ?? image?.alt ?? '',
    width: options.width,
    height: options.height,
    sizes: options.sizes,
    fit: cover ? 'cover' : undefined,
    modifiers: sanityModifiers(image, cover)
  }
}

// Builds a Sanity CDN URL through @nuxt/image, for places that need a plain URL
// (meta tags, avatars, UBlogPost images). Use <AppImage> for page images.
export function useSanityImage() {
  const img = useImage()

  return (image: SanityImageValue | null | undefined, modifiers: Partial<ImageModifiers> = {}) => {
    const ref = image?.asset?._ref
    if (!ref) return undefined
    const cover = Boolean(modifiers.width && modifiers.height)
    return img(ref, {
      ...sanityModifiers(image, cover),
      ...(cover ? { fit: 'cover' } : {}),
      ...modifiers
    })
  }
}
