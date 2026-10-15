import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

// Tells the Presentation tool where each document is shown on the frontend.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => ({
        locations: [{
          title: doc?.title || 'Untitled',
          href: doc?.slug === 'home' ? '/' : `/${doc?.slug}`
        }]
      })
    }),
    collection: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => ({
        locations: [{ title: doc?.title || 'Untitled', href: `/${doc?.slug}` }]
      })
    }),
    entry: defineLocations({
      select: { title: 'title', slug: 'slug.current', collectionTitle: 'collection.title', collectionSlug: 'collection.slug.current' },
      resolve: doc => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/${doc?.collectionSlug}/${doc?.slug}` },
          { title: doc?.collectionTitle || 'Collection', href: `/${doc?.collectionSlug}` }
        ]
      })
    }),
    settings: defineLocations({
      message: 'Used in the header and footer of every page',
      tone: 'positive'
    })
  }
}
