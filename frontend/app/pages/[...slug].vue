<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import { ROUTE_QUERY } from '~/utils/queries'

// Every URL on the site is resolved here:
//   /                     → the page with slug "home"
//   /about, /company/team → a page
//   /blog, /projects      → a collection (list of entries)
//   /blog/my-post         → an entry of the "blog" collection
// Languages other than the site language add a prefix: /id, /id/about, /id/blog/my-post.
const route = useRoute()
const config = useLanguageConfig()

const location = computed(() => splitLanguagePath(route.path, config.value))
const language = computed(() => location.value.language)

// The site language has no prefix: /en/about → /about (Presentation links to both)
if (location.value.prefixed && language.value === config.value.defaultLanguage) {
  const query = new URLSearchParams(route.query as Record<string, string>).toString()
  await navigateTo(`/${location.value.parts.join('/')}${query ? `?${query}` : ''}`, { redirectCode: 301 })
}

const parts = computed(() => location.value.parts)
const params = {
  path: computed(() => parts.value.join('/') || 'home'),
  parent: computed(() => parts.value.slice(0, -1).join('/')),
  child: computed(() => parts.value.at(-1) ?? ''),
  language,
  defaultLanguage: computed(() => config.value.defaultLanguage),
  languages: computed(() => config.value.languages),
  fallback: computed(() => config.value.fallback)
}

const { data, encodeDataAttribute } = await useSanityQuery(ROUTE_QUERY, params)

const page = computed(() => data.value?.page)
const collection = computed(() => page.value ? null : data.value?.collection)
const entry = computed(() => page.value || collection.value ? null : data.value?.entry)

if (!page.value && !collection.value && !entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// An untranslated page shown in the site language ("Show untranslated pages in
// the site language" in Site Settings). Kept out of search results: the original
// URL is the one to index.
const current = computed(() => page.value ?? collection.value ?? entry.value)
const contentLanguage = computed(() => stegaClean(current.value?.language) ?? language.value)
const isFallback = computed(() => contentLanguage.value !== language.value)
const t = useLabels()
if (isFallback.value) {
  useRobotsRule('noindex, follow')
}

if (page.value) {
  usePageSeo(() => ({
    title: page.value?.seo?.title || (params.path.value === 'home' ? undefined : page.value?.title),
    description: page.value?.seo?.description,
    image: page.value?.seo?.image,
    noIndex: page.value?.seo?.noIndex
  }))
}

// Language versions of this page: the language switcher links to them, and
// search engines get hreflang links (x-default is the site language). Languages
// without a translation get the closest page instead: the same page in that
// language with fallback on, else an entry's translated collection.
const translations = usePageTranslations()
watchEffect(() => {
  const clean = (items: { language: string | null, path: string }[] | null | undefined, exact: boolean) =>
    (items ?? []).map(item => ({ language: stegaClean(item.language) ?? '', path: stegaClean(item.path), exact }))
      .filter(item => item.language)
  const exact = clean(current.value?.translations, true)
  const missing = (code: string) => !exact.some(item => item.language === code)

  // URL of the site-language version, when this page has one
  const defaultPath = exact.find(item => item.language === config.value.defaultLanguage)?.path
    ?? (contentLanguage.value === config.value.defaultLanguage ? `/${parts.value.join('/')}` : undefined)
  const fallbacks = config.value.fallback && defaultPath
    ? config.value.languages.filter(missing).map(code => ({ language: code, path: localePath(defaultPath, code, config.value), exact: false }))
    : clean(entry.value?.collection?.translations, false).filter(item => missing(item.language))
  translations.value = [...exact, ...fallbacks]
})

const siteConfig = useSiteConfig()
const alternateLinks = computed(() => {
  const exact = translations.value.filter(item => item.exact)
  if (exact.length < 2) return []
  const href = (path: string) => new URL(path, siteConfig.url).href
  const fallback = exact.find(item => item.language === config.value.defaultLanguage)
  return [
    ...exact.map(item => ({ rel: 'alternate' as const, hreflang: item.language, href: href(item.path) })),
    ...(fallback ? [{ rel: 'alternate' as const, hreflang: 'x-default', href: href(fallback.path) }] : [])
  ]
})
useHead({ link: alternateLinks })
</script>

<template>
  <div :lang="isFallback ? contentLanguage : undefined">
    <div
      v-if="isFallback"
      :lang="language"
    >
      <UContainer class="flex items-center gap-2 py-3 text-sm text-muted">
        <UIcon
          name="i-lucide-languages"
          class="size-4 shrink-0"
        />
        {{ t('notTranslated', { language: languageName(language) }) }}
      </UContainer>
    </div>
    <PageBlocks
      v-if="page"
      :blocks="page.blocks"
      :base-path="['page']"
      :encode-data-attribute="encodeDataAttribute"
    />
    <CollectionView
      v-else-if="collection"
      :collection="collection"
      :encode-data-attribute="encodeDataAttribute"
    />
    <EntryView
      v-else-if="entry"
      :entry="entry"
      :encode-data-attribute="encodeDataAttribute"
    />
  </div>
</template>
