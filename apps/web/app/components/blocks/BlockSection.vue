<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'section'>
  index: number
}>()

const features = computed(() => props.block.features?.map(feature => ({
  title: feature.title,
  description: feature.description,
  icon: stegaClean(feature.icon)
})))
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :icon="stegaClean(block.icon)"
    :title="block.title"
    :description="block.description"
    :links="toButtons(block.links)"
    :features="features"
    :orientation="stegaClean(block.orientation) ?? 'vertical'"
    :reverse="block.reverse"
    :ui="{
      ...sectionUi,
      // Features rise in one by one across each row of three
      features: '*:reveal [&>*:nth-child(3n+2)]:[--reveal-index:1] [&>*:nth-child(3n)]:[--reveal-index:2]'
    }"
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

    <template
      v-if="block.image?.asset"
      #default
    >
      <div class="reveal-wipe overflow-hidden bg-elevated">
        <AppImage
          :image="block.image"
          :width="960"
          sizes="100vw lg:50vw"
          class="parallax h-auto w-full"
        />
      </div>
    </template>
  </UPageSection>
</template>
