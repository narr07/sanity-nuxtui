<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { FooterColumn, Locale, Messages, NavigationMenuItem } from '@nuxt/ui'
import en from '@nuxt/ui/runtime/locale/en.js'
import type { SiteSeo } from '~/composables/usePageSeo'
import type { Labels } from '~/utils/labels'
import { LANGUAGES_QUERY, SETTINGS_QUERY } from '~/utils/queries'

const route = useRoute()

// Languages first: the language of the URL decides which settings to load
const { data: languageSettings } = await useSanityQuery(LANGUAGES_QUERY)
const languageConfig = useLanguageConfig()
watchEffect(() => {
  const defaultLanguage = stegaClean(languageSettings.value?.defaultLanguage) || 'en'
  const others = (languageSettings.value?.languages ?? []).map(code => stegaClean(code)).filter(code => code && code !== defaultLanguage)
  languageConfig.value = {
    defaultLanguage,
    languages: [defaultLanguage, ...new Set(others)],
    fallback: languageSettings.value?.fallback ?? true
  }
})
const language = useSiteLanguage()

// Header, footer and site-wide SEO come from Site Settings, with the
// "settings-<language>" copy filling in translated fields.
const { data: settings } = await useSanityQuery(SETTINGS_QUERY, {
  language,
  defaultLanguage: computed(() => languageConfig.value.defaultLanguage),
  fallback: computed(() => languageConfig.value.fallback),
  translationId: computed(() => `settings-${language.value}`)
})

const labels = useState<Labels>('labels')
watchEffect(() => {
  labels.value = mergeLabels(settings.value?.labels, settings.value?.translatedLabels)
})

// Nuxt UI's own text (close buttons, carousel arrows, …) in the current language
const uiLocale = shallowRef<Locale<Messages>>(en)
uiLocale.value = await loadUiLocale(language.value)
watch(language, async (code) => {
  uiLocale.value = await loadUiLocale(code)
})

const siteConfig = useSiteConfig()
const siteTitle = computed(() => stegaClean(settings.value?.title) || siteConfig.name)
// About 0.42em per character in Funnel Display at this tracking
const wordmarkSize = computed(() => `min(15rem, calc((min(100vw, 80rem) - 4rem) / ${((siteTitle.value?.length ?? 8) + 1) * 0.42}))`)
const urlFor = useSanityImage()
const homePath = computed(() => localePath('/', language.value, languageConfig.value))

// Every URL is served by the same catch-all route, so the router would mark any
// internal link as active. Decide it from the path instead: the homepage only on
// itself, "/blog" on /blog and /blog/<entry>, anchors and external links never.
function isActive(to: string | undefined) {
  if (!to || !to.startsWith('/') || to.includes('#') || to.includes('?')) return false
  if (to === homePath.value) return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

const navigation = computed<NavigationMenuItem[]>(() => (settings.value?.navigation ?? []).map((link) => {
  const to = stegaClean(link.to) ?? undefined
  return {
    label: link.label ?? '',
    to,
    target: link.newTab ? '_blank' : undefined,
    icon: stegaClean(link.icon) ?? undefined,
    active: isActive(to)
  }
}))

const footerColumns = computed<FooterColumn[]>(() => (settings.value?.footerColumns ?? []).map(column => ({
  label: column.label,
  children: (column.links ?? []).map((link) => {
    const to = stegaClean(link.to) ?? undefined
    return {
      label: link.label ?? '',
      to,
      target: link.newTab ? '_blank' : undefined,
      active: isActive(to)
    }
  })
})))

// Many languages fit better in a dropdown than side by side
const switcherVariant = computed(() => (languageConfig.value.languages.length > 3 ? 'menu' : 'list'))

useHead({
  link: [{ rel: 'icon', href: '/favicon.ico' }]
})

// Nuxt SEO sets `lang` and og:locale from its site config, which knows one
// language only. Rewrite them on the final tags so the page language wins.
injectHead()?.hooks?.hook('tags:resolve', ({ tags }) => {
  for (const tag of tags) {
    if (tag.tag === 'htmlAttrs') {
      tag.props.lang = language.value
      tag.props.dir = uiLocale.value.dir
    }
    if (tag.tag === 'meta' && tag.props.property === 'og:locale') {
      tag.props.content = language.value.replace('-', '_')
    }
  }
})

useSeoMeta({
  titleTemplate: title => title ? `${title} · ${siteTitle.value}` : siteTitle.value,
  description: () => settings.value?.description,
  ogSiteName: siteTitle
})

// Read by usePageSeo(): the site name and the optional default social image.
// No og:image is set here, so pages can fall back to a generated image.
const siteSeo = useState<SiteSeo>('site-seo')
watchEffect(() => {
  siteSeo.value = { name: siteTitle.value, ogImage: settings.value?.ogImage }
})
</script>

<template>
  <UApp :locale="uiLocale">
    <UHeader :to="homePath">
      <template #title>
        <img
          v-if="settings?.logo?.asset"
          :src="urlFor(settings.logo, { height: 64 })"
          :alt="siteTitle"
          class="h-7 w-auto"
        >
        <span
          v-else
          class="font-heading"
        >{{ siteTitle }}</span>
      </template>

      <UNavigationMenu :items="navigation" />

      <template #right>
        <UContentSearchButton
          v-if="settings?.search"
          :collapsed="true"
        />
        <LanguageSwitcher
          :variant="switcherVariant"
          class="hidden sm:flex"
        />
        <UColorModeButton />
        <UButton
          v-for="link in toButtons(settings?.headerLinks)"
          :key="link.label"
          v-bind="link"
          size="sm"
          class="hidden sm:inline-flex"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="navigation"
          orientation="vertical"
          class="-mx-2.5"
        />
        <LanguageSwitcher class="mt-4 -mx-1.5" />
        <div
          v-if="settings?.headerLinks?.length"
          class="mt-4 flex flex-col gap-2"
        >
          <UButton
            v-for="link in toButtons(settings.headerLinks)"
            :key="link.label"
            v-bind="link"
            block
          />
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter :ui="{ root: 'border-t border-default', top: 'pt-16 pb-10 sm:pt-24 lg:pt-24 lg:pb-12' }">
      <template #top>
        <UContainer>
          <UFooterColumns
            v-if="footerColumns.length"
            :columns="footerColumns"
          />
          <!-- The site name set as a wordmark closes every page, sized to fill the row -->
          <p
            aria-hidden="true"
            class="reveal mt-16 font-heading leading-[0.85] font-semibold tracking-[-0.06em] whitespace-nowrap text-highlighted select-none sm:mt-24"
            :style="{ fontSize: wordmarkSize }"
          >
            {{ siteTitle }}<span class="text-primary">.</span>
          </p>
        </UContainer>
      </template>

      <template #left>
        <p class="text-sm text-muted">
          {{ settings?.footerText || `© ${new Date().getFullYear()} ${siteTitle}` }}
        </p>
      </template>

      <template #right>
        <UButton
          v-for="social in settings?.socialLinks ?? []"
          :key="social._key"
          :to="stegaClean(social.url)"
          target="_blank"
          :icon="stegaClean(social.icon)"
          :aria-label="social.label"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>

    <ClientOnly>
      <SiteSearch v-if="settings?.search" />
    </ClientOnly>
  </UApp>
</template>
