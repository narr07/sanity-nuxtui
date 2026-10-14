// https://nuxt.com/docs/api/configuration/nuxt-config
const readToken = process.env.NUXT_SANITY_API_READ_TOKEN

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxtjs/sanity'
  ],

  components: [
    // Page builder blocks keep their file names (BlockHero, BlockFaq, …) without a folder prefix
    { path: '~/components/blocks', pathPrefix: false },
    '~/components'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Used by sitemap, robots, canonical URLs and schema.org.
  // Override per environment with NUXT_SITE_URL / NUXT_SITE_NAME.
  site: {
    url: 'http://localhost:3000',
    name: 'Sanity × Nuxt UI',
    defaultLocale: 'en'
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Social images come from Sanity (SEO image, cover image or the default in Site Settings)
  ogImage: {
    enabled: false
  },

  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_SANITY_DATASET || 'production',
    apiVersion: '2026-10-01',
    useCdn: true,
    // Visual Editing is only enabled when a read token is present (needed for drafts)
    visualEditing: readToken
      ? {
          token: readToken,
          studioUrl: process.env.NUXT_SANITY_STUDIO_URL || 'http://localhost:3333',
          stega: true
        }
      : undefined
  },

  schemaOrg: {
    identity: 'Organization'
  },

  sitemap: {
    // Pages, posts and galleries from Sanity
    sources: ['/api/__sitemap__/urls']
  }
})
