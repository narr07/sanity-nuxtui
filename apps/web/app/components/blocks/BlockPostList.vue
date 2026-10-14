<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

const props = defineProps<{
  block: BlockOf<'postList'>
  index: number
}>()

const toBlogPost = useBlogPostProps()
const posts = computed(() => (props.block.posts ?? []).slice(0, props.block.limit ?? 3).map(toBlogPost))
const viewAll = computed(() => toButton(props.block.link))
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UBlogPosts v-if="posts.length">
      <UBlogPost
        v-for="{ key, ...post } in posts"
        :key="key"
        v-bind="post"
      />
    </UBlogPosts>
    <UEmpty
      v-else
      icon="i-lucide-file-text"
      title="No posts yet"
      description="Published posts will show up here."
    />

    <div
      v-if="viewAll?.label"
      class="flex justify-center"
    >
      <UButton
        v-bind="viewAll"
        size="lg"
      />
    </div>
  </UPageSection>
</template>
