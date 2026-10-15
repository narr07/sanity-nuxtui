<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'testimonials'>
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

    <UPageColumns>
      <UPageCard
        v-for="(item, itemIndex) in block.items"
        :key="item._key"
        variant="subtle"
        :description="item.quote"
        class="reveal"
        :style="revealIndex(itemIndex)"
        :ui="{ description: 'font-heading text-xl/8 tracking-tight text-highlighted before:content-[open-quote] after:content-[close-quote]' }"
      >
        <template #footer>
          <UUser
            :name="item.name"
            :description="item.role"
            :avatar="sanityImgProps(item.avatar, { alt: item.avatar?.alt || item.name }) ?? { alt: item.name }"
            size="lg"
          />
        </template>
      </UPageCard>
    </UPageColumns>
  </UPageSection>
</template>
