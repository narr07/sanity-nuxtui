<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'callout'>
  index: number
}>()
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UAlert
      :title="block.title"
      :description="block.description"
      :icon="stegaClean(block.icon) || 'i-lucide-info'"
      :color="stegaClean(block.color) ?? 'primary'"
      :variant="stegaClean(block.variant) ?? 'subtle'"
      :actions="toButtons(block.links)"
      orientation="horizontal"
      class="reveal mx-auto max-w-4xl"
    />
  </UContainer>
</template>
