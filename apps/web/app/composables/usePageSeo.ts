import type { MaybeRefOrGetter } from 'vue'
import type { SanityImageSource } from '@sanity/image-url'

interface PageSeoInput {
  title?: string | null
  description?: string | null
  image?: (SanityImageSource & { asset?: unknown }) | null
  noIndex?: boolean | null
  type?: 'website' | 'article'
}

// Title, description, social image and robots for a page. The social image is
// cropped to 1200×630 from Sanity; pages without one fall back to the default
// image from Site Settings (set in app.vue).
export function usePageSeo(input: MaybeRefOrGetter<PageSeoInput>) {
  const urlFor = useSanityImage()
  const seo = computed(() => toValue(input))

  useSeoMeta({
    title: () => seo.value.title || undefined,
    description: () => seo.value.description || undefined,
    ogType: () => seo.value.type ?? 'website',
    ogImage: () => seo.value.image?.asset
      ? urlFor(seo.value.image).width(1200).height(630).fit('crop').url()
      : undefined
  })

  if (seo.value.noIndex) {
    useRobotsRule('noindex, nofollow')
  }
}
