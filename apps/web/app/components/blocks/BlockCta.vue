<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'cta'>
  index: number
}>()
</script>

<template>
  <UPageSection>
    <UPageCTA
      :title="block.title"
      :description="block.description"
      :links="toButtons(block.links)"
      :variant="stegaClean(block.variant) ?? 'subtle'"
      :orientation="stegaClean(block.orientation) ?? 'vertical'"
      :reverse="block.reverse"
    >
      <template
        v-if="block.image?.asset"
        #default
      >
        <AppImage
          :image="block.image"
          :width="640"
          sizes="100vw lg:50vw"
          class="h-auto w-full rounded-lg"
        />
      </template>
    </UPageCTA>
  </UPageSection>
</template>
