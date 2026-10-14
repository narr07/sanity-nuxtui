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
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/blog/${doc?.slug}` },
          { title: 'Blog', href: '/blog' }
        ]
      })
    }),
    gallery: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: doc => ({
        locations: [
          { title: doc?.title || 'Untitled', href: `/gallery/${doc?.slug}` },
          { title: 'Galleries', href: '/gallery' }
        ]
      })
    }),
    settings: defineLocations({
      message: 'Used in the header and footer of every page',
      tone: 'positive'
    })
  }
}
