<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { FooterColumn, NavigationMenuItem } from '@nuxt/ui'
import { SETTINGS_QUERY } from '~/utils/queries'

// Header, footer and site-wide SEO all come from the "Site Settings" singleton.
const { data: settings } = await useSanityQuery(SETTINGS_QUERY)

const siteConfig = useSiteConfig()
const siteTitle = computed(() => stegaClean(settings.value?.title) || siteConfig.name)
const urlFor = useSanityImage()
const route = useRoute()

const navigation = computed<NavigationMenuItem[]>(() => (settings.value?.navigation ?? []).map((link) => {
  const to = stegaClean(link.to) ?? undefined
  return {
    label: link.label ?? '',
    to,
    target: link.newTab ? '_blank' : undefined,
    icon: stegaClean(link.icon) ?? undefined,
    // Keep "Blog" active on /blog/my-post, but not "Home" on every page
    active: to && to !== '/' && !to.includes('#') ? route.path.startsWith(to) : undefined
  }
}))

const footerColumns = computed<FooterColumn[]>(() => (settings.value?.footerColumns ?? []).map(column => ({
  label: column.label,
  children: (column.links ?? []).map(link => ({
    label: link.label ?? '',
    to: stegaClean(link.to) ?? undefined,
    target: link.newTab ? '_blank' : undefined
  }))
})))

useHead({
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  titleTemplate: title => title ? `${title} · ${siteTitle.value}` : siteTitle.value,
  description: () => settings.value?.description,
  ogSiteName: siteTitle,
  ogImage: () => settings.value?.ogImage?.asset
    ? urlFor(settings.value.ogImage).width(1200).height(630).fit('crop').url()
    : undefined,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <img
          v-if="settings?.logo?.asset"
          :src="urlFor(settings.logo).height(64).url()"
          :alt="siteTitle"
          class="h-7 w-auto"
        >
        <span v-else>{{ siteTitle }}</span>
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

    <USeparator />

    <UFooter :ui="{ top: footerColumns.length ? 'py-12' : 'hidden' }">
      <template #top>
        <UContainer>
          <UFooterColumns :columns="footerColumns" />
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
