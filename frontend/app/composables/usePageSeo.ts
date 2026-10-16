import type { MaybeRefOrGetter } from 'vue'
import { stegaClean } from '@sanity/client/stega'
import type { SanityImageValue } from '~/composables/useSanityImage'

interface PageSeoInput {
  title?: string | null
  description?: string | null
  /** Small label above the title in the generated image, e.g. the collection name */
  headline?: string | null
  image?: SanityImageValue | null
  noIndex?: boolean | null
  type?: 'website' | 'article'
}

export interface SiteSeo {
  name: string
  ogImage?: SanityImageValue | null
}

function truncate(text: string | undefined, max: number) {
  if (!text || text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

// Title, description, robots and the social image for a page.
// Social image, first match wins:
//   1. the image passed in (SEO image, cover image, first photo)
//   2. the default image from Site Settings
//   3. a generated image (components/OgImage/Page.takumi.vue)
export function usePageSeo(input: MaybeRefOrGetter<PageSeoInput>) {
  const urlFor = useSanityImage()
  const site = useState<SiteSeo>('site-seo')
  const seo = computed(() => toValue(input))

  useSeoMeta({
    title: () => seo.value.title || undefined,
    description: () => seo.value.description || undefined,
    ogType: () => seo.value.type ?? 'website'
  })

  const image = seo.value.image?.asset ? seo.value.image : site.value?.ogImage?.asset ? site.value.ogImage : null

  if (image) {
    useSeoMeta({
      ogImage: () => urlFor(image, { width: 1200, height: 630 }),
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: () => stegaClean(image.alt) || seo.value.title || undefined
    })
  } else {
    defineOgImage('Page', {
      title: truncate(stegaClean(seo.value.title) || site.value?.name, 90),
      description: truncate(stegaClean(seo.value.description) ?? undefined, 150),
      headline: stegaClean(seo.value.headline) ?? undefined,
      siteName: site.value?.name
    })
  }

  if (seo.value.noIndex) {
    useRobotsRule('noindex, nofollow')
  }
}
