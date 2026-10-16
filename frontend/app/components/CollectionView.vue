<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { CollectionData } from '~/types/sanity'

// The list page of a collection, e.g. /blog or /projects
const props = defineProps<{
  collection: CollectionData
  encodeDataAttribute?: (path: (string | number)[]) => unknown
}>()

const route = useRoute()
const t = useLabels()
const activeTag = computed(() => typeof route.query.tag === 'string' ? route.query.tag : undefined)

// Every tag used by at least one entry, most used first
const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const tag of props.collection.entries.flatMap(entry => entry.tags ?? [])) {
    const clean = stegaClean(tag)
    counts.set(clean, (counts.get(clean) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
})

const entries = computed(() => {
  const sorted = sortEntries(props.collection.entries, props.collection.sort)
  return activeTag.value ? sorted.filter(entry => hasTag(entry, activeTag.value!)) : sorted
})

const path = computed(() => stegaClean(props.collection.path) ?? '/')

usePageSeo(() => ({
  title: activeTag.value
    ? `${props.collection.title}: ${activeTag.value}`
    : props.collection.seo?.title || props.collection.title,
  description: props.collection.seo?.description || props.collection.description,
  image: props.collection.seo?.image,
  noIndex: props.collection.seo?.noIndex
}))
</script>

<template>
  <div>
    <UContainer>
      <UPageHeader
        :title="collection.title"
        :description="collection.description ?? undefined"
        :ui="{
          title: 'intro text-5xl sm:text-7xl',
          description: 'intro [--intro-index:1]'
        }"
      />

      <UPageBody :class="collection.blocks?.length ? 'pb-0' : undefined">
        <div
          v-if="collection.tagFilter && tags.length"
          class="flex flex-wrap gap-2"
        >
          <UButton
            :label="t('allTags')"
            :to="path"
            size="sm"
            :color="activeTag ? 'neutral' : 'primary'"
            :variant="activeTag ? 'subtle' : 'solid'"
          />
          <UButton
            v-for="tag in tags"
            :key="tag"
            :label="tag"
            :to="{ path, query: { tag } }"
            size="sm"
            :color="tag === activeTag ? 'primary' : 'neutral'"
            :variant="tag === activeTag ? 'solid' : 'subtle'"
          />
        </div>

        <EntryList
          v-if="entries.length"
          :entries="entries"
          :layout="collection.layout"
          :featured="!activeTag"
        />
        <UEmpty
          v-else
          icon="i-lucide-folder-open"
          :title="activeTag ? t('emptyTagTitle') : t('emptyTitle')"
          :description="activeTag ? t('emptyTagDescription', { tag: activeTag }) : t('emptyDescription')"
          :actions="activeTag ? [{ label: t('showAll'), to: path, color: 'neutral', variant: 'subtle' }] : undefined"
        />
      </UPageBody>
    </UContainer>

    <PageBlocks
      :blocks="collection.blocks"
      :base-path="['collection']"
      :encode-data-attribute="encodeDataAttribute"
    />
  </div>
</template>
