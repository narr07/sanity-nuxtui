import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

// The site answers /<language>/... for every language and redirects the site
// language to its unprefixed URL, so locations can always include the language.
function prefix(language: string | undefined) {
  return language ? `/${language}` : ''
}

// Tells the Presentation tool where each document is shown on the frontend.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: doc => ({
        locations: [{
          title: doc?.title || 'Untitled',
          href: doc?.slug === 'home' ? prefix(doc?.language) || '/' : `${prefix(doc?.language)}/${doc?.slug}`
        }]
      })
    }),
    collection: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: doc => ({
        locations: [{ title: doc?.title || 'Untitled', href: `${prefix(doc?.language)}/${doc?.slug}` }]
      })
    }),
    entry: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
        language: 'language',
        collectionTitle: 'collection.title',
        collectionSlug: 'collection.slug.current'
      },
      resolve: (doc) => {
        const collectionPath = `${prefix(doc?.language)}/${doc?.collectionSlug}`
        return {
          locations: [
            { title: doc?.title || 'Untitled', href: `${collectionPath}/${doc?.slug}` },
            { title: doc?.collectionTitle || 'Collection', href: collectionPath }
          ]
        }
      }
    }),
    settings: defineLocations({
      message: 'Used in the header and footer of every page',
      tone: 'positive'
    })
  }
}
