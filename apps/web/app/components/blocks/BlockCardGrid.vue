<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'cardGrid'>
  index: number
}>()
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UPageGrid :class="gridColumns(block.cards?.length)">
      <UPageCard
        v-for="card in block.cards"
        :key="card._key"
        :title="card.title"
        :description="card.description"
        :icon="stegaClean(card.icon)"
        :to="stegaClean(card.link?.to) ?? undefined"
        :target="card.link?.newTab ? '_blank' : undefined"
        :variant="stegaClean(block.variant)"
        :spotlight="card.spotlight"
        :highlight="card.highlight"
        :highlight-color="stegaClean(card.highlightColor)"
        :ui="cardUi"
      >
        <AppImage
          v-if="card.image?.asset"
          :image="card.image"
          :width="480"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          class="h-auto w-full rounded-md"
        />
      </UPageCard>
    </UPageGrid>
  </UPageSection>
</template>
