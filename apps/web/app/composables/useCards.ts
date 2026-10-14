import { stegaClean } from '@sanity/client/stega'
import type { BlogPostProps } from '@nuxt/ui'
import type { PostCard } from '~/types/sanity'

// Maps Sanity posts to UBlogPost props, shared by /blog and the Latest Posts block.
export function useBlogPostProps() {
  const urlFor = useSanityImage()

  return (post: PostCard): BlogPostProps & { key: string } => ({
    key: post._id,
    title: post.title,
    description: post.excerpt ?? undefined,
    date: formatDate(post.publishedAt),
    to: `/blog/${stegaClean(post.slug)}`,
    badge: post.tags?.[0] ? { label: post.tags[0], color: 'neutral', variant: 'subtle' } : undefined,
    image: post.coverImage?.asset
      ? { src: urlFor(post.coverImage).width(800).height(450).url(), alt: post.coverImage.alt ?? '', width: 800, height: 450 }
      : undefined,
    authors: post.authors?.map(author => ({
      name: author.name,
      description: author.role ?? undefined,
      avatar: author.avatar?.asset
        ? { src: urlFor(author.avatar).width(64).height(64).url(), alt: author.name }
        : { alt: author.name }
    }))
  })
}
