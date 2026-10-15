import type { SitemapUrlInput } from '#sitemap/types'
import { LANGUAGES_QUERY, SITEMAP_QUERY } from '~~/app/utils/queries'
import type { LANGUAGES_QUERY_RESULT, SITEMAP_QUERY_RESULT } from '~~/sanity.types'

// Adds every published page, collection and entry from Sanity to /sitemap.xml,
// in every language, with hreflang alternatives between translations.
export default defineSitemapEventHandler(async (event) => {
  const sanity = useSanity(event)
  const settings = await sanity.fetch<LANGUAGES_QUERY_RESULT>(LANGUAGES_QUERY)
  const defaultLanguage = settings?.defaultLanguage ?? 'en'
  const languages = [defaultLanguage, ...(settings?.languages ?? [])]

  const documents = await sanity.fetch<SITEMAP_QUERY_RESULT>(SITEMAP_QUERY, { defaultLanguage, languages, language: defaultLanguage })

  return documents.filter(document => document.path).map(document => ({
    loc: document.path!,
    lastmod: document._updatedAt,
    alternatives: document.translations && document.translations.length > 1
      ? document.translations.map(translation => ({ hreflang: translation.language ?? defaultLanguage, href: translation.path }))
      : undefined
  })) satisfies SitemapUrlInput[]
})
