import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export function useSanityImage() {
  const { client } = useSanity()
  const builder = createImageUrlBuilder(client)

  return (source: SanityImageSource) => builder.image(source).auto('format').fit('max')
}

// Asset refs look like "image-<id>-<width>x<height>-<ext>", so the dimensions can be
// read without an extra query. Used for width/height attributes to avoid layout shift.
export function getImageDimensions(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-/)
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined
}
