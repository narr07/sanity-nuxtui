<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'faq'>
  index: number
}>()

const items = computed(() => props.block.items?.map(item => ({
  value: item._key,
  label: item.question,
  content: item.answer
})))
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UAccordion
      :items="items"
      type="multiple"
      class="mx-auto w-full max-w-3xl"
      :ui="{ trigger: 'text-base', body: 'text-base text-muted' }"
    />
  </UPageSection>
</template>
