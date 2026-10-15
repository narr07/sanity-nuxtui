import type { LabelKey, Labels } from '~/utils/labels'

// Shared state filled by app.vue from Site Settings, before any page renders.
export function useLanguageConfig() {
  return useState<LanguageConfig>('language-config', () => DEFAULT_LANGUAGE_CONFIG)
}

// The language of the current URL
export function useSiteLanguage() {
  const config = useLanguageConfig()
  const route = useRoute()
  return computed(() => splitLanguagePath(route.path, config.value).language)
}

// Other language versions of the current page, set by the page itself; used by
// the language switcher and hreflang links. `exact: false` marks a fallback, such
// as the translated collection of an entry that has no translation yet.
export interface PageTranslation {
  language: string
  path: string
  exact: boolean
}

export function usePageTranslations() {
  return useState<PageTranslation[]>('page-translations', () => [])
}

// Interface text in the current language: t('photos', { count: 12 })
export function useLabels() {
  const labels = useState<Labels>('labels', () => mergeLabels())
  return (key: LabelKey, values?: Record<string, string | number>) => fillLabel(labels.value[key], values)
}

// Dates in the current language. A fixed time zone keeps server and client output identical.
export function useFormatDate() {
  const language = useSiteLanguage()
  const formatter = computed(() => new Intl.DateTimeFormat(language.value, { dateStyle: 'long', timeZone: 'UTC' }))
  return (value: string | null | undefined) => formatDate(value, formatter.value)
}
