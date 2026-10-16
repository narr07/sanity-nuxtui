<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'hero'>
  index: number
}>()

// The first block gets the entrance animation; a hero further down the page
// reveals on scroll like any other section
const isFirst = computed(() => props.index === 0)
</script>

<template>
  <UPageHero
    :description="block.description"
    :links="toButtons(block.links)"
    :orientation="stegaClean(block.orientation) ?? 'horizontal'"
    :reverse="block.reverse"
    :ui="{
      description: isFirst ? 'intro [--intro-index:2]' : 'reveal',
      links: isFirst ? 'intro [--intro-index:3]' : 'reveal'
    }"
  >
    <template
      v-if="block.headline"
      #headline
    >
      <SectionLabel
        :text="block.headline"
        :class="isFirst ? 'intro' : 'reveal'"
      />
    </template>

    <template #title>
      <span :class="isFirst ? 'intro-mask' : 'reveal'">{{ block.title }}</span>
    </template>

    <template
      v-if="block.image?.asset"
      #default
    >
      <div
        class="overflow-hidden bg-elevated"
        :class="isFirst ? 'intro [--intro-index:2]' : 'reveal-wipe'"
      >
        <AppImage
          :image="block.image"
          :width="960"
          sizes="100vw lg:50vw"
          :loading="isFirst ? 'eager' : 'lazy'"
          class="parallax h-auto w-full"
        />
      </div>
    </template>
  </UPageHero>
</template>
