<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { CollectionLayout, EntryCard } from '~/types/sanity'

// Renders collection entries in one of three layouts chosen in Studio:
// blog (UBlogPost), cards (UPageCard) or gallery (photo tiles).
const props = withDefaults(defineProps<{
  entries: EntryCard[]
  layout?: CollectionLayout | null
  /** Shows the first blog entry full width */
  featured?: boolean
}>(), {
  layout: 'cards',
  featured: false
})

const urlFor = useSanityImage()
const layout = computed(() => stegaClean(props.layout) ?? 'cards')

function blogImage(entry: EntryCard) {
  return entry.cover?.asset
    ? { src: urlFor(entry.cover).width(800).height(450).url(), alt: entry.cover.alt ?? '', width: 800, height: 450 }
    : undefined
}

function authors(entry: EntryCard) {
  return entry.authors?.map(author => ({
    name: author.name,
    description: author.role ?? undefined,
    avatar: author.avatar?.asset
      ? { src: urlFor(author.avatar).width(64).height(64).url(), alt: author.name }
      : { alt: author.name }
  }))
}
</script>

<template>
  <UBlogPosts
    v-if="layout === 'blog'"
    :class="gridColumns(featured ? entries.length - 1 : entries.length, { wide: true })"
  >
    <UBlogPost
      v-for="(entry, index) in entries"
      :key="entry._id"
      :title="entry.title"
      :description="entry.excerpt ?? undefined"
      :date="formatDate(entry.publishedAt)"
      :to="stegaClean(entry.path)"
      :image="blogImage(entry)"
      :authors="authors(entry)"
      :badge="entry.tags?.[0] ? { label: entry.tags[0], color: 'neutral', variant: 'subtle' } : undefined"
      :orientation="featured && index === 0 ? 'horizontal' : 'vertical'"
      :class="featured && index === 0 ? 'col-span-full' : undefined"
    />
  </UBlogPosts>

  <UPageGrid
    v-else-if="layout === 'gallery'"
    :class="gridColumns(entries.length)"
  >
    <NuxtLink
      v-for="entry in entries"
      :key="entry._id"
      :to="stegaClean(entry.path)"
      class="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
    >
      <AppImage
        v-if="entry.cover?.asset"
        :image="entry.cover"
        :width="640"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 pt-12">
        <p class="font-semibold text-white">
          {{ entry.title }}
        </p>
        <p class="text-sm text-white/80">
          {{ entry.imageCount ?? 0 }} photos<template v-if="entry.publishedAt">
            · {{ formatDate(entry.publishedAt) }}
          </template>
        </p>
      </div>
    </NuxtLink>
  </UPageGrid>

  <UPageGrid
    v-else
    :class="gridColumns(entries.length)"
  >
    <UPageCard
      v-for="entry in entries"
      :key="entry._id"
      :title="entry.title"
      :description="entry.excerpt ?? undefined"
      :to="stegaClean(entry.path)"
      variant="subtle"
      reverse
      :ui="cardUi"
    >
      <AppImage
        v-if="entry.cover?.asset"
        :image="entry.cover"
        :width="640"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        class="aspect-[4/3] h-auto w-full rounded-md object-cover"
      />
      <template
        v-if="entry.tags?.length"
        #footer
      >
        <div class="flex flex-wrap gap-1.5">
          <UBadge
            v-for="tag in entry.tags.slice(0, 3)"
            :key="tag"
            :label="tag"
            color="neutral"
            variant="subtle"
          />
        </div>
      </template>
    </UPageCard>
  </UPageGrid>
</template>
