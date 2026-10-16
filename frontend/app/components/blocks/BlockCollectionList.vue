<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'collectionList'>
  index: number
}>()

const entries = computed(() => sortEntries(props.block.collection?.entries ?? [], props.block.collection?.sort)
  .slice(0, props.block.limit ?? 3))
const viewAll = computed(() => toButton(props.block.link))
const t = useLabels()
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :title="block.title ?? block.collection?.title"
    :description="block.description"
    :ui="sectionUi"
  >
    <template
      v-if="block.headline"
      #headline
    >
      <SectionLabel
        :text="block.headline"
        :index="index"
      />
    </template>

    <EntryList
      v-if="entries.length"
      :entries="entries"
      :layout="block.collection?.layout"
    />
    <UEmpty
      v-else
      icon="i-lucide-folder-open"
      :title="t('emptyTitle')"
      :description="t('emptyDescription')"
    />

    <div
      v-if="viewAll?.label"
      class="reveal"
    >
      <UButton
        v-bind="viewAll"
        size="lg"
      />
    </div>
  </UPageSection>
</template>
