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

    <UPageGrid :class="gridColumns(block.cards?.length)">
      <UPageCard
        v-for="(card, cardIndex) in block.cards"
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
        class="reveal"
        :style="revealIndex(cardIndex, block.cards?.length === 4 ? 4 : 3)"
      >
        <div
          v-if="card.image?.asset"
          class="overflow-hidden"
        >
          <AppImage
            :image="card.image"
            :width="640"
            sizes="100vw sm:50vw lg:33vw"
            class="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </UPageCard>
    </UPageGrid>
  </UPageSection>
</template>
