<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'cta'>
  index: number
}>()
</script>

<template>
  <UPageSection :ui="{ container: 'py-12 sm:py-16 lg:py-20' }">
    <UPageCTA
      :title="block.title"
      :description="block.description"
      :links="toButtons(block.links)"
      :variant="stegaClean(block.variant) ?? 'subtle'"
      :orientation="stegaClean(block.orientation) ?? 'vertical'"
      :reverse="block.reverse"
      class="reveal"
      :ui="{ title: 'reveal' }"
    >
      <template
        v-if="block.image?.asset"
        #default
      >
        <div class="reveal-wipe overflow-hidden">
          <AppImage
            :image="block.image"
            :width="800"
            sizes="100vw lg:50vw"
            class="parallax h-auto w-full"
          />
        </div>
      </template>
    </UPageCTA>
  </UPageSection>
</template>
