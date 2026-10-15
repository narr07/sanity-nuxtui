<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'hero'>
  index: number
}>()
</script>

<template>
  <UPageHero
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
    :links="toButtons(block.links)"
    :orientation="stegaClean(block.orientation) ?? 'horizontal'"
    :reverse="block.reverse"
  >
    <template
      v-if="block.image?.asset"
      #default
    >
      <AppImage
        :image="block.image"
        :width="720"
        sizes="100vw lg:50vw"
        :loading="index === 0 ? 'eager' : 'lazy'"
        class="h-auto w-full rounded-lg shadow-2xl ring ring-default"
      />
    </template>
  </UPageHero>
</template>
