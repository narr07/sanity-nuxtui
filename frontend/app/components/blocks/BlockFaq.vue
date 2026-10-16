<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'faq'>
  index: number
}>()

const items = computed(() => props.block.items?.map((item, itemIndex) => ({
  value: item._key,
  label: `${String(itemIndex + 1).padStart(2, '0')}  ${item.question}`,
  content: item.answer
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

    <!-- Questions sit in the right-hand columns of the grid, under the title -->
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <UAccordion
        :items="items"
        type="multiple"
        class="reveal border-t border-default lg:col-span-9 lg:col-start-4"
        :ui="{ label: 'whitespace-pre-wrap', body: 'text-base text-muted max-w-2xl' }"
      />
    </div>
  </UPageSection>
</template>
