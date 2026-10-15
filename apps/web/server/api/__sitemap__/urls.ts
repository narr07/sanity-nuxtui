import type { SitemapUrlInput } from '#sitemap/types'
import { SITEMAP_QUERY } from '~~/app/utils/queries'
import type { SITEMAP_QUERY_RESULT } from '~~/sanity.types'

// Adds every published page, collection and entry from Sanity to /sitemap.xml.
export default defineSitemapEventHandler(async (event) => {
  const { pages, collections, entries } = await useSanity(event).fetch<SITEMAP_QUERY_RESULT>(SITEMAP_QUERY)

  return [
    ...pages.map(page => ({ loc: page.slug === 'home' ? '/' : `/${page.slug}`, lastmod: page._updatedAt })),
    ...collections.map(collection => ({ loc: `/${collection.slug}`, lastmod: collection._updatedAt })),
    ...entries.map(entry => ({ loc: entry.path, lastmod: entry._updatedAt }))
  ] satisfies SitemapUrlInput[]
})
