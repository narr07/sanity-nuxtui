<script setup lang="ts">
import type { Locale, Messages } from '@nuxt/ui'

// Nuxt UI's LocaleSelect over the site languages. Picking one opens the current
// page in that language, else the closest translated page (an entry's
// collection), else the homepage of that language.
const config = useLanguageConfig()
const language = useSiteLanguage()
const translations = usePageTranslations()
const t = useLabels()

// LocaleSelect only reads the code (for the flag) and the name of each locale
const locales = computed(() => config.value.languages.map(code => ({
  code,
  name: languageName(code),
  dir: 'ltr',
  messages: {} as Messages
}) satisfies Locale<Messages>))

function pathFor(code: string) {
  return translations.value.find(item => item.language === code)?.path ?? localePath('/', code, config.value)
}

async function select(code: string) {
  if (code !== language.value) await navigateTo(pathFor(code))
}
</script>

<template>
  <ULocaleSelect
    v-if="locales.length > 1"
    :model-value="language"
    :locales="locales"
    :aria-label="t('language')"
    color="neutral"
    variant="ghost"
    @update:model-value="select"
  />
</template>
