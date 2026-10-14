<script setup lang="ts">
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'richText'>
  index: number
}>()
</script>

<template>
  <UContainer class="py-16 sm:py-24">
    <div class="mx-auto max-w-3xl">
      <PortableText
        v-if="block.body"
        :value="block.body"
      />
    </div>
  </UContainer>
</template>
