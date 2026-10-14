import type { SitemapUrlInput } from '#sitemap/types'
import { SITEMAP_QUERY } from '~~/app/utils/queries'
import type { SITEMAP_QUERY_RESULT } from '~~/sanity.types'

// Adds every published page, post and gallery from Sanity to /sitemap.xml.
export default defineSitemapEventHandler(async (event) => {
  const { pages, posts, galleries } = await useSanity(event).fetch<SITEMAP_QUERY_RESULT>(SITEMAP_QUERY)

  return [
    ...pages.map(page => ({ loc: page.slug === 'home' ? '/' : `/${page.slug}`, lastmod: page._updatedAt })),
    { loc: '/blog' },
    ...posts.map(post => ({ loc: `/blog/${post.slug}`, lastmod: post._updatedAt })),
    { loc: '/gallery' },
    ...galleries.map(gallery => ({ loc: `/gallery/${gallery.slug}`, lastmod: gallery._updatedAt }))
  ] satisfies SitemapUrlInput[]
})
