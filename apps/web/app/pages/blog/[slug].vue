<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import { POST_QUERY } from '~/utils/queries'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: post } = await useSanityQuery(POST_QUERY, { slug })

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const urlFor = useSanityImage()
const toBlogPost = useBlogPostProps()
const related = computed(() => (post.value?.related ?? []).map(toBlogPost))

usePageSeo(() => ({
  title: post.value?.seo?.title || post.value?.title,
  description: post.value?.seo?.description || post.value?.excerpt,
  image: post.value?.seo?.image ?? post.value?.coverImage,
  noIndex: post.value?.seo?.noIndex,
  type: 'article'
}))

useSchemaOrg([
  defineArticle({
    headline: stegaClean(post.value.title),
    description: stegaClean(post.value.excerpt) ?? undefined,
    image: post.value.coverImage?.asset ? urlFor(post.value.coverImage).width(1200).url() : undefined,
    datePublished: stegaClean(post.value.publishedAt),
    dateModified: post.value._updatedAt,
    author: post.value.authors?.map(author => ({ name: stegaClean(author.name) }))
  })
])
</script>

<template>
  <UContainer v-if="post">
    <UPage>
      <UPageHeader
        :title="post.title"
        :description="post.excerpt ?? undefined"
      >
        <template #headline>
          <UButton
            to="/blog"
            icon="i-lucide-arrow-left"
            label="Blog"
            color="neutral"
            variant="link"
            class="-ms-1.5 p-0"
          />
          <span class="text-muted">·</span>
          <time
            :datetime="stegaClean(post.publishedAt)"
            class="text-muted"
          >{{ formatDate(post.publishedAt) }}</time>
        </template>

        <div
          v-if="post.authors?.length"
          class="mt-4 flex flex-wrap gap-6"
        >
          <UUser
            v-for="author in post.authors"
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
          v-if="post.coverImage?.asset"
          :image="post.coverImage"
          :width="1200"
          sizes="(min-width: 1280px) 1200px, 100vw"
          loading="eager"
          class="aspect-video h-auto w-full rounded-lg object-cover"
        />

        <div class="mx-auto max-w-3xl">
          <PortableText
            v-if="post.body"
            :value="post.body"
          />

          <div
            v-if="post.tags?.length"
            class="mt-10 flex flex-wrap items-center gap-2 border-t border-default pt-6"
          >
            <span class="text-sm text-muted">Tags:</span>
            <UButton
              v-for="tag in post.tags"
              :key="tag"
              :label="tag"
              :to="{ path: '/blog', query: { tag: stegaClean(tag) } }"
              size="xs"
              color="neutral"
              variant="subtle"
            />
          </div>
        </div>

        <template v-if="related.length">
          <USeparator class="my-4" />
          <h2 class="text-2xl font-bold text-highlighted">
            Related posts
          </h2>
          <UBlogPosts>
            <UBlogPost
              v-for="{ key, ...item } in related"
              :key="key"
              v-bind="item"
            />
          </UBlogPosts>
        </template>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
