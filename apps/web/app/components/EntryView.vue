<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { EntryData } from '~/types/sanity'

// The detail page of an entry, e.g. /blog/my-post or /projects/acme
const props = defineProps<{
  entry: EntryData
  encodeDataAttribute?: (path: (string | number | { _key: string })[]) => unknown
}>()

const urlFor = useSanityImage()
const collectionPath = computed(() => `/${stegaClean(props.entry.collection?.slug)}`)
const relatedLabel = computed(() => `Related ${plural((stegaClean(props.entry.collection?.entryLabel) || 'Entry').toLowerCase())}`)

usePageSeo(() => ({
  title: props.entry.seo?.title || props.entry.title,
  description: props.entry.seo?.description || props.entry.excerpt,
  image: props.entry.seo?.image ?? props.entry.coverImage ?? props.entry.images?.[0],
  noIndex: props.entry.seo?.noIndex,
  type: 'article'
}))

useSchemaOrg([
  defineArticle({
    headline: stegaClean(props.entry.title),
    description: stegaClean(props.entry.excerpt) ?? undefined,
    image: props.entry.coverImage?.asset ? urlFor(props.entry.coverImage).width(1200).url() : undefined,
    datePublished: stegaClean(props.entry.publishedAt) ?? undefined,
    dateModified: props.entry._updatedAt,
    author: props.entry.authors?.map(author => ({ name: stegaClean(author.name) }))
  })
])
</script>

<template>
  <div>
    <UContainer>
      <UPage>
        <UPageHeader
          :title="entry.title"
          :description="entry.excerpt ?? undefined"
        >
          <template #headline>
            <UButton
              :to="collectionPath"
              icon="i-lucide-arrow-left"
              :label="entry.collection?.title ?? 'Back'"
              color="neutral"
              variant="link"
              class="-ms-1.5 p-0"
            />
            <template v-if="entry.publishedAt">
              <span class="text-muted">·</span>
              <time
                :datetime="stegaClean(entry.publishedAt)"
                class="text-muted"
              >{{ formatDate(entry.publishedAt) }}</time>
            </template>
          </template>

          <div
            v-if="entry.authors?.length"
            class="mt-4 flex flex-wrap gap-6"
          >
            <UUser
              v-for="author in entry.authors"
              :key="author._id"
              :name="author.name"
              :description="author.role ?? undefined"
              :avatar="author.avatar?.asset
                ? { src: urlFor(author.avatar).width(80).height(80).url(), alt: author.name }
                : { alt: author.name }"
            />
          </div>
        </UPageHeader>

        <UPageBody>
          <AppImage
            v-if="entry.coverImage?.asset"
            :image="entry.coverImage"
            :width="1200"
            sizes="(min-width: 1280px) 1200px, 100vw"
            loading="eager"
            class="aspect-video h-auto w-full rounded-lg object-cover"
          />

          <dl
            v-if="entry.details?.length"
            class="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-default p-6 sm:grid-cols-4"
          >
            <div
              v-for="detail in entry.details"
              :key="detail._key"
            >
              <dt class="text-sm text-muted">
                {{ detail.label }}
              </dt>
              <dd class="mt-1 font-medium text-highlighted">
                <ULink
                  v-if="detail.url"
                  :to="stegaClean(detail.url)"
                  target="_blank"
                  class="text-primary underline underline-offset-4 hover:no-underline"
                >
                  {{ detail.value }}
                </ULink>
                <template v-else>
                  {{ detail.value }}
                </template>
              </dd>
            </div>
          </dl>

          <div
            v-if="entry.body?.length"
            class="mx-auto w-full max-w-3xl"
          >
            <PortableText :value="entry.body" />
          </div>

          <ImageGrid
            v-if="entry.images?.length"
            :images="entry.images"
          />

          <div
            v-if="entry.tags?.length"
            class="flex flex-wrap items-center gap-2 border-t border-default pt-6"
          >
            <span class="text-sm text-muted">Tags:</span>
            <UButton
              v-for="tag in entry.tags"
              :key="tag"
              :label="tag"
              :to="entry.collection?.tagFilter ? { path: collectionPath, query: { tag: stegaClean(tag) } } : undefined"
              size="xs"
              color="neutral"
              variant="subtle"
            />
          </div>
        </UPageBody>
      </UPage>
    </UContainer>

    <PageBlocks
      :blocks="entry.blocks"
      :base-path="['entry']"
      :encode-data-attribute="encodeDataAttribute"
    />

    <UContainer v-if="entry.collection?.showRelated && entry.related.length">
      <UPageSection :title="relatedLabel">
        <EntryList
          :entries="entry.related"
          layout="blog"
        />
      </UPageSection>
    </UContainer>
  </div>
</template>
