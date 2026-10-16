<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { SEARCH_QUERY } from '~/utils/queries'
import type { SEARCH_QUERY_RESULT } from '~~/sanity.types'

// Search palette opened by <UContentSearchButton> or Ctrl/⌘ + K. Queries the
// Sanity CDN straight from the browser (published content only), so it also
// works on static hosting. Nuxt UI translates its own text (placeholder, empty
// state) through the locale set on <UApp>.
const config = useLanguageConfig()
const language = useSiteLanguage()
const client = useSanity().client.withConfig({ useCdn: true, perspective: 'published', stega: false, token: undefined })

const searchTerm = ref('')
const results = ref<SEARCH_QUERY_RESULT>([])
const loading = ref(false)

const ICONS = { page: 'i-lucide-file-text', collection: 'i-lucide-folder', entry: 'i-lucide-newspaper' } as const

// "nuxt ima" → ["nuxt*", "ima*"]: every word must match, as a prefix
function toTerms(query: string) {
  return query.toLowerCase().split(/\s+/)
    .map(word => word.replace(/[^\p{L}\p{N}-]/gu, ''))
    .filter(Boolean)
    .slice(0, 6)
    .map(word => `${word}*`)
}

let timer: ReturnType<typeof setTimeout> | undefined
let latest = 0
watch(searchTerm, (query) => {
  clearTimeout(timer)
  const terms = toTerms(query)
  if (!terms.length) {
    results.value = []
    loading.value = false
    return
  }
  loading.value = true
  timer = setTimeout(async () => {
    const request = ++latest
    try {
      const found = await client.fetch(SEARCH_QUERY, {
        terms,
        language: language.value,
        defaultLanguage: config.value.defaultLanguage,
        fallback: config.value.fallback
      })
      if (request === latest) results.value = found
    } catch {
      if (request === latest) results.value = []
    } finally {
      if (request === latest) loading.value = false
    }
  }, 200)
})

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => [{
  id: 'results',
  // Results are already ranked by Sanity: no client-side filtering
  ignoreFilter: true,
  items: results.value.filter(result => result.path).map(result => ({
    label: result.title ?? '',
    suffix: result.collection ?? undefined,
    description: result.description ?? undefined,
    icon: ICONS[result._type],
    to: result.path!
  }))
}])
</script>

<template>
  <LazyUContentSearch
    v-model:search-term="searchTerm"
    :groups="groups"
    :loading="loading"
    :color-mode="false"
    :fuse="{ resultLimit: 10 }"
  />
</template>
