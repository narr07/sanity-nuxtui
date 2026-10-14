import { defineField, defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons/Compose'
import { imageField } from '../shared/fields'

// Blog posts: a fixed structure rendered by the /blog/[slug] template in Nuxt.
export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: ComposeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta' },
    { name: 'seo', title: 'SEO' }
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: rule => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The post URL: /blog/<slug>',
      options: { source: 'title', maxLength: 96 },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on post cards and used as the default meta description',
      validation: rule => rule.max(200)
    }),
    { ...imageField('coverImage', 'Cover image'), group: 'content' },
    defineField({ name: 'body', title: 'Body', type: 'blockContent', group: 'content' }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: rule => rule.required()
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: [{ type: 'author' }] }]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      description: 'Lowercase keywords. Readers can filter the blog by tag.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' })
  ],
  orderings: [
    { title: 'Newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'coverImage', author: 'authors.0.name' },
    prepare: ({ title, date, media, author }) => ({
      title,
      subtitle: [date ? new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'No date', author].filter(Boolean).join(' · '),
      media
    })
  }
})
