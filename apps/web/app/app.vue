<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { FooterColumn, NavigationMenuItem } from '@nuxt/ui'
import type { SiteSeo } from '~/composables/usePageSeo'
import { SETTINGS_QUERY } from '~/utils/queries'

// Header, footer and site-wide SEO all come from the "Site Settings" singleton.
const { data: settings } = await useSanityQuery(SETTINGS_QUERY)

const siteConfig = useSiteConfig()
const siteTitle = computed(() => stegaClean(settings.value?.title) || siteConfig.name)
// About 0.42em per character in Funnel Display at this tracking
const wordmarkSize = computed(() => `min(15rem, calc((min(100vw, 80rem) - 4rem) / ${((siteTitle.value?.length ?? 8) + 1) * 0.42}))`)
const urlFor = useSanityImage()
const route = useRoute()

// Every URL is served by the same catch-all route, so the router would mark any
// internal link as active. Decide it from the path instead: "/" only on the
// homepage, "/blog" on /blog and /blog/<entry>, anchors and external links never.
function isActive(to: string | undefined) {
  if (!to || !to.startsWith('/') || to.includes('#') || to.includes('?')) return false
  if (to === '/') return route.path === '/'
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

useHead({
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  titleTemplate: title => title ? `${title} · ${siteTitle.value}` : siteTitle.value,
  description: () => settings.value?.description,
  ogSiteName: siteTitle
})

// Read by usePageSeo(): the site name and the optional default social image.
// No og:image is set here, so pages can fall back to a generated image.
const siteSeo = useState<SiteSeo>('site-seo')
siteSeo.value = { name: siteTitle.value, ogImage: settings.value?.ogImage }
</script>

<template>
  <UApp>
    <UHeader>
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
  </UApp>
</template>
