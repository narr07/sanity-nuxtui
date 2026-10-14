<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import { POSTS_QUERY } from '~/utils/queries'

const route = useRoute()
const { data: posts } = await useSanityQuery(POSTS_QUERY)

const activeTag = computed(() => typeof route.query.tag === 'string' ? route.query.tag : undefined)

// Every tag used by at least one post, most used first
const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const tag of (posts.value ?? []).flatMap(post => post.tags ?? [])) {
    const clean = stegaClean(tag)
    counts.set(clean, (counts.get(clean) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
})

const toBlogPost = useBlogPostProps()
const visiblePosts = computed(() => (posts.value ?? [])
  .filter(post => !activeTag.value || post.tags?.some(tag => stegaClean(tag) === activeTag.value))
  .map(toBlogPost)
)

usePageSeo(() => ({
  title: activeTag.value ? `Posts tagged "${activeTag.value}"` : 'Blog',
  description: 'News, guides and updates.'
}))
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Blog"
      description="News, guides and updates."
    />

    <UPageBody>
      <div
        v-if="tags.length"
        class="flex flex-wrap gap-2"
      >
        <UButton
          label="All"
          to="/blog"
          size="sm"
          :color="activeTag ? 'neutral' : 'primary'"
          :variant="activeTag ? 'subtle' : 'solid'"
        />
        <UButton
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          :to="{ path: '/blog', query: { tag } }"
          size="sm"
          :color="tag === activeTag ? 'primary' : 'neutral'"
          :variant="tag === activeTag ? 'solid' : 'subtle'"
        />
      </div>

      <UBlogPosts v-if="visiblePosts.length">
        <UBlogPost
          v-for="({ key, ...post }, index) in visiblePosts"
          :key="key"
          v-bind="post"
          :orientation="index === 0 && !activeTag ? 'horizontal' : 'vertical'"
          :class="index === 0 && !activeTag ? 'col-span-full' : undefined"
        />
      </UBlogPosts>
      <UEmpty
        v-else
        icon="i-lucide-file-text"
        title="No posts found"
        :description="activeTag ? `There are no posts tagged '${activeTag}' yet.` : 'Create your first post in Sanity Studio.'"
        :actions="activeTag ? [{ label: 'Show all posts', to: '/blog', color: 'neutral', variant: 'subtle' }] : undefined"
      />
    </UPageBody>
  </UContainer>
</template>
