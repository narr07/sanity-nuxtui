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
    :title="block.title"
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

    <UTimeline
      :items="items"
      :orientation="orientation"
      :color="stegaClean(block.color) ?? 'primary'"
      :default-value="items.at(-1)?.value"
      :class="orientation === 'vertical' ? 'reveal w-full max-w-2xl lg:ml-[calc(25%+0.5rem)]' : 'reveal w-full overflow-x-auto pb-2'"
    />
  </UPageSection>
</template>
