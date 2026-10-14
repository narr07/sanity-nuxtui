import { defineField, defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons/Compose'
import { anchorField, headerFields } from '../shared/fields'

// UPageSection > UBlogPosts: the latest posts, on any page.
export const postList = defineType({
  name: 'postList',
  title: 'Latest Posts',
  type: 'object',
  icon: ComposeIcon,
  description: 'Shows the most recent blog posts automatically',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'limit',
      title: 'Number of posts',
      type: 'number',
      initialValue: 3,
      validation: rule => rule.min(1).max(12).integer()
    }),
    defineField({ name: 'tag', title: 'Only posts tagged', type: 'string', description: 'Optional. Leave empty to show all posts.' }),
    defineField({ name: 'link', title: '"View all" button', type: 'link' })
  ],
  preview: {
    select: { title: 'title', limit: 'limit', tag: 'tag' },
    prepare: ({ title, limit, tag }) => ({
      title: title || 'Latest Posts',
      subtitle: `Latest Posts · ${limit ?? 3} posts${tag ? ` tagged "${tag}"` : ''}`,
      media: ComposeIcon
    })
  }
})
