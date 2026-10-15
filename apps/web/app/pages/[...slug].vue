<script setup lang="ts">
import { ROUTE_QUERY } from '~/utils/queries'

// Every URL on the site is resolved here:
//   /                     → the page with slug "home"
//   /about, /company/team → a page
//   /blog, /projects      → a collection (list of entries)
//   /blog/my-post         → an entry of the "blog" collection
const route = useRoute()

const parts = computed(() => ([] as string[]).concat(route.params.slug ?? []).filter(Boolean))
const params = {
  path: computed(() => parts.value.join('/') || 'home'),
  parent: computed(() => parts.value.slice(0, -1).join('/')),
  child: computed(() => parts.value.at(-1) ?? '')
}

const { data, encodeDataAttribute } = await useSanityQuery(ROUTE_QUERY, params)

const page = computed(() => data.value?.page)
const collection = computed(() => page.value ? null : data.value?.collection)
const entry = computed(() => page.value || collection.value ? null : data.value?.entry)

if (!page.value && !collection.value && !entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (page.value) {
  usePageSeo(() => ({
    title: page.value?.seo?.title || (params.path.value === 'home' ? undefined : page.value?.title),
    description: page.value?.seo?.description,
    image: page.value?.seo?.image,
    noIndex: page.value?.seo?.noIndex
  }))
}
</script>

<template>
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
</template>
