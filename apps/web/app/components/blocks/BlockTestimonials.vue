<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'testimonials'>
  index: number
}>()

const urlFor = useSanityImage()
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UPageColumns>
      <UPageCard
        v-for="item in block.items"
        :key="item._key"
        variant="subtle"
        :description="item.quote"
        :ui="{ description: 'text-base text-default before:content-[open-quote] after:content-[close-quote]' }"
      >
        <template #footer>
          <UUser
            :name="item.name"
            :description="item.role"
            :avatar="item.avatar?.asset
              ? { src: urlFor(item.avatar).width(80).height(80).url(), alt: item.avatar.alt || item.name }
              : { alt: item.name }"
            size="lg"
          />
        </template>
      </UPageCard>
    </UPageColumns>
  </UPageSection>
</template>
