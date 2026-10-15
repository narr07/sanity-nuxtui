<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { EntryData } from '~/types/sanity'

// The detail page of an entry, e.g. /blog/my-post or /projects/acme
const props = defineProps<{
  entry: EntryData
  encodeDataAttribute?: (path: (string | number)[]) => unknown
}>()

const urlFor = useSanityImage()
const t = useLabels()
const formatDate = useFormatDate()

// The fields this entry uses ("Fields on this entry" in the Studio). Entries
// created before that setting existed show everything.
function uses(field: 'body' | 'images' | 'blocks' | 'details' | 'authors') {
  const sections = props.entry.sections?.map(section => stegaClean(section))
  return !sections || sections.includes(field)
}

// Table of contents from the body headings, when the collection turns it on
const toc = computed(() => {
  if (!props.entry.collection?.toc || !uses('body')) return []
  const headings = getHeadings(props.entry.body)
  return headings.length >= 2 ? getTocLinks(headings) : []
})
const collectionPath = computed(() => stegaClean(props.entry.collection?.path) ?? '/')
const relatedLabel = computed(() => t('relatedEntries', {
  entries: plural((stegaClean(props.entry.collection?.entryLabel) || 'Entry').toLowerCase())
}))

usePageSeo(() => ({
  title: props.entry.seo?.title || props.entry.title,
  description: props.entry.seo?.description || props.entry.excerpt,
  headline: props.entry.collection?.title,
  image: props.entry.seo?.image ?? props.entry.coverImage ?? props.entry.images?.[0],
  noIndex: props.entry.seo?.noIndex,
  type: 'article'
}))

useSchemaOrg([
  defineArticle({
    headline: stegaClean(props.entry.title),
    description: stegaClean(props.entry.excerpt) ?? undefined,
    image: props.entry.coverImage?.asset ? urlFor(props.entry.coverImage, { width: 1200 }) : undefined,
    datePublished: stegaClean(props.entry.publishedAt) ?? undefined,
    dateModified: props.entry._updatedAt,
    author: props.entry.authors?.map(author => ({ name: stegaClean(author.name) }))
  })
])
</script>

<template>
  <div>
    <!-- Reading progress, a thin line under the header -->
    <div
      aria-hidden="true"
      class="scroll-progress fixed inset-x-0 top-(--ui-header-height) z-40 h-0.5 bg-primary"
    />

    <UContainer>
      <UPage>
        <UPageHeader
          :title="entry.title"
          :description="entry.excerpt ?? undefined"
          :ui="{
            headline: 'intro',
            title: 'intro [--intro-index:1] text-4xl sm:text-6xl',
            description: 'intro [--intro-index:2]'
          }"
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
            v-if="uses('authors') && entry.authors?.length"
            class="intro mt-6 flex flex-wrap gap-6 [--intro-index:3]"
          >
            <UUser
              v-for="author in entry.authors"
              :key="author._id"
              :name="author.name"
              :description="author.role ?? undefined"
              :avatar="sanityImgProps(author.avatar, { alt: author.name }) ?? { alt: author.name }"
            />
          </div>
        </UPageHeader>

        <UPageBody>
          <AppImage
            v-if="entry.coverImage?.asset"
            :image="entry.coverImage"
            :width="1200"
            sizes="100vw xl:1200px"
            loading="eager"
            class="intro aspect-video h-auto w-full object-cover [--intro-index:4]"
          />

          <dl
            v-if="uses('details') && entry.details?.length"
            class="reveal grid grid-cols-2 gap-x-6 gap-y-6 border-y border-default py-6 sm:grid-cols-4"
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
            v-if="uses('body') && entry.body?.length"
            class="mx-auto w-full max-w-3xl"
          >
            <PortableText :value="entry.body" />
          </div>

          <ImageGrid
            v-if="uses('images') && entry.images?.length"
            :images="entry.images"
          />

          <div
            v-if="entry.tags?.length"
            class="flex flex-wrap items-center gap-2 border-t border-default pt-6"
          >
            <span class="text-sm text-muted">{{ t('tags') }}:</span>
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

        <template
          v-if="toc.length"
          #right
        >
          <UContentToc
            :links="toc"
            :title="t('onThisPage')"
            highlight
          />
        </template>
      </UPage>
    </UContainer>

    <PageBlocks
      :blocks="uses('blocks') ? entry.blocks : null"
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
