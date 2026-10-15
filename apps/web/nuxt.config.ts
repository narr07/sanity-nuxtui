// https://nuxt.com/docs/api/configuration/nuxt-config
import { getSanityRoutes } from './prerender-routes'

const readToken = process.env.NUXT_SANITY_API_READ_TOKEN
const projectId = process.env.NUXT_SANITY_PROJECT_ID || ''
const dataset = process.env.NUXT_SANITY_DATASET || 'production'
const apiVersion = '2026-10-01'

// Rendering mode (NUXT_RENDER_MODE):
//   ssr     server rendering with ISR/SWR caching (default)
//   hybrid  every Sanity URL is prerendered at build; the server still renders
//           new pages, OG images and previews
//   static  everything is prerendered (`pnpm generate`), no server needed
// With hybrid and static, published changes need a rebuild: point a Sanity
// webhook at your host's deploy hook.
const renderMode = (process.env.NUXT_RENDER_MODE ?? 'ssr') as 'ssr' | 'hybrid' | 'static'
const prerenderAll = renderMode !== 'ssr'

// Caching. Pages are served from cache and refreshed in the background after
// NUXT_CACHE_TTL seconds (default 60): ISR on Vercel, stale-while-revalidate
// everywhere else (Cloudflare, Node). Set NUXT_CACHE_TTL=0 to turn it off.
// Deployments with a read token (Visual Editing / Presentation) are never cached,
// because cached pages cannot show drafts.
const preset = process.env.NITRO_PRESET ?? ''
const isVercel = process.env.VERCEL === '1' || preset.startsWith('vercel')
const cacheTtl = readToken || renderMode === 'static' ? 0 : Number(process.env.NUXT_CACHE_TTL ?? 60)
const noCache = isVercel ? { isr: false } : { cache: false as const }
const routeRules = cacheTtl > 0
  ? {
      '/**': isVercel
        // `tag` filters collection pages, so it must be part of the cache key
        ? { isr: { expiration: cacheTtl, allowQuery: ['tag'] } }
        : { swr: cacheTtl },
      // nuxt-og-image caches generated images itself; a wildcard ISR/SWR rule breaks /_og/
      '/_og/**': noCache,
      // Code highlighting, sitemap source and Sanity preview endpoints
      '/api/**': noCache,
      '/_sanity/**': noCache,
      '/preview/**': noCache,
      '/__skew/**': noCache
    }
  : {}

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxtjs/sanity'
  ],

  // Only in production builds, so content changes show up immediately in dev
  $production: {
    routeRules
  },

  components: [
    // Page builder blocks keep their file names (BlockHero, BlockFaq, …) without a folder prefix
    { path: '~/components/blocks', pathPrefix: false },
    '~/components'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Used by sitemap, robots, canonical URLs, OG images and schema.org.
  // Override per environment with NUXT_SITE_URL / NUXT_SITE_NAME.
  site: {
    url: 'http://localhost:3000',
    name: 'Sanity × Nuxt UI',
    defaultLocale: 'en'
  },

  ui: {
    // @nuxt/fonts is installed directly (v1 is needed for fonts in OG images)
    fonts: false,
    // Registers the Prose components (ProsePre, ProseCodeGroup, …) without a
    // Markdown parser: rich text is Portable Text from Sanity, not Markdown
    prose: true
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    // Cloudflare Workers: generates the Wrangler config with the ASSETS binding
    // (OG image fonts are read from it) and Node.js compatibility.
    // Ignored by other deploy targets.
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    // hybrid / static: prerender every Sanity URL (added in the hook below),
    // plus anything linked from those pages
    prerender: prerenderAll
      ? { crawlLinks: true, routes: ['/', '/sitemap.xml', '/robots.txt'] }
      : undefined
  },

  hooks: {
    async 'prerender:routes'({ routes }) {
      if (!prerenderAll) return
      for (const route of await getSanityRoutes(projectId, dataset, apiVersion)) routes.add(route)
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // `global: true` makes the theme fonts available to generated OG images too
  fonts: {
    families: [
      { name: 'Funnel Display', weights: [400, 500, 600, 700], global: true },
      { name: 'Funnel Sans', weights: [400, 500, 600], global: true },
      { name: 'JetBrains Mono', weights: [400, 500] }
    ]
  },

  // All images come from the Sanity image CDN, so Sanity is the default provider
  image: {
    provider: 'sanity',
    sanity: {
      projectId,
      dataset
    }
  },

  // Pages without an SEO, cover or default image get one rendered from
  // components/OgImage/Page.takumi.vue. Set NUXT_APP_SECRET in production.
  // Node and Vercel use the native renderer (@takumi-rs/core); Cloudflare Workers
  // use the Wasm build (@takumi-rs/wasm) automatically.
  ogImage: {
    defaults: {
      width: 1200,
      height: 630
    },
    // In dev, the server is rebuilt on every change. Reloading Takumi's native
    // binary in the same process crashes it on Windows, so dev uses the Wasm build
    // instead. Production keeps the faster native renderer (@takumi-rs/core).
    compatibility: {
      dev: { takumi: 'wasm' }
    },
    // static: images are rendered during prerendering only, no runtime renderer
    zeroRuntime: renderMode === 'static'
  },

  sanity: {
    projectId,
    dataset,
    apiVersion,
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
    // Pages, collections and entries from Sanity
    sources: ['/api/__sitemap__/urls']
  }
})
