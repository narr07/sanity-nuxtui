<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

// Links to the current page in every language. Without a translation it links
// to the closest translated page (an entry's collection), else the homepage.
withDefaults(defineProps<{
  /** list: language codes side by side (header). menu: a dropdown, for many languages */
  variant?: 'list' | 'menu'
}>(), {
  variant: 'list'
})

const config = useLanguageConfig()
const language = useSiteLanguage()
const translations = usePageTranslations()
const t = useLabels()

// On the server the header renders before the page sets its translations, so
// the first HTML links to the homepages. Render the links again once mounted.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const options = computed(() => config.value.languages.map((code) => {
  const translation = translations.value.find(item => item.language === code)
  return {
    code,
    name: languageName(code),
    to: code === language.value ? undefined : translation?.path ?? localePath('/', code, config.value),
    active: code === language.value
  }
}))

const menuItems = computed<DropdownMenuItem[]>(() => options.value.map(option => ({
  label: option.name,
  to: option.to,
  type: option.active ? 'checkbox' : 'link',
  checked: option.active
})))
</script>

<template>
  <template v-if="options.length > 1">
    <UDropdownMenu
      v-if="variant === 'menu'"
      :key="`menu-${mounted}`"
      :items="menuItems"
    >
      <UButton
        :label="language.toUpperCase()"
        :aria-label="t('language')"
        icon="i-lucide-languages"
        color="neutral"
        variant="ghost"
      />
    </UDropdownMenu>

    <nav
      v-else
      :key="`list-${mounted}`"
      :aria-label="t('language')"
      class="flex items-center text-sm font-medium"
    >
      <template
        v-for="(option, index) in options"
        :key="option.code"
      >
        <span
          v-if="index"
          aria-hidden="true"
          class="text-dimmed"
        >/</span>
        <span
          v-if="option.active"
          :lang="option.code"
          :title="option.name"
          aria-current="true"
          class="px-1.5 py-1 text-highlighted uppercase"
        >{{ option.code }}</span>
        <ULink
          v-else
          :to="option.to"
          :lang="option.code"
          :hreflang="option.code"
          :title="option.name"
          class="px-1.5 py-1 text-muted uppercase transition-colors hover:text-highlighted"
        >
          {{ option.code }}
        </ULink>
      </template>
    </nav>
  </template>
</template>
