<script setup lang="ts">
import { PAGE_QUERY } from '~/utils/queries'

// Every page built in Sanity. The page with slug "home" is served at "/",
// nested slugs such as "company/team" work too.
const route = useRoute()
const slug = computed(() => {
  const parts = ([] as string[]).concat(route.params.slug ?? [])
  return parts.filter(Boolean).join('/') || 'home'
})

const { data: page, encodeDataAttribute } = await useSanityQuery(PAGE_QUERY, { slug })

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

usePageSeo(() => ({
  title: page.value?.seo?.title || (slug.value === 'home' ? undefined : page.value?.title),
  description: page.value?.seo?.description,
  image: page.value?.seo?.image,
  noIndex: page.value?.seo?.noIndex
}))
</script>

<template>
  <PageBlocks
    v-if="page"
    :blocks="page.blocks"
    :encode-data-attribute="encodeDataAttribute"
  />
</template>
