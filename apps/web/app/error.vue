<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const t = useLabels()
const language = useSiteLanguage()
const config = useLanguageConfig()

useHead({ htmlAttrs: { lang: language } })
useSeoMeta({
  robots: 'noindex'
})
</script>

<template>
  <UApp>
    <UError
      :error="error.statusCode === 404 ? { ...error, statusMessage: t('notFound') } : error"
      :clear="{ label: t('backHome') }"
      :redirect="localePath('/', language, config)"
    />
  </UApp>
</template>
