<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'timeline'>
  index: number
}>()

const orientation = computed(() => stegaClean(props.block.orientation) ?? 'vertical')

const items = computed(() => (props.block.items ?? []).map(item => ({
  value: item._key,
  date: item.date ?? undefined,
  title: item.title,
  description: item.description ?? undefined,
  icon: stegaClean(item.icon) || 'i-lucide-circle-dot'
})))
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UTimeline
      :items="items"
      :orientation="orientation"
      :color="stegaClean(block.color) ?? 'primary'"
      :default-value="items.at(-1)?.value"
      :class="orientation === 'vertical' ? 'mx-auto w-full max-w-2xl' : 'w-full overflow-x-auto pb-2'"
    />
  </UPageSection>
</template>
