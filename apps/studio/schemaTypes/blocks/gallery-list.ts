import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'
import { anchorField, headerFields } from '../shared/fields'

// UPageSection > UPageGrid > UPageCard: the latest galleries, on any page.
export const galleryList = defineType({
  name: 'galleryList',
  title: 'Latest Galleries',
  type: 'object',
  icon: ImagesIcon,
  description: 'Shows the most recent galleries as cover cards',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'limit',
      title: 'Number of galleries',
      type: 'number',
      initialValue: 3,
      validation: rule => rule.min(1).max(12).integer()
    }),
    defineField({ name: 'link', title: '"View all" button', type: 'link' })
  ],
  preview: {
    select: { title: 'title', limit: 'limit' },
    prepare: ({ title, limit }) => ({ title: title || 'Latest Galleries', subtitle: `Latest Galleries · ${limit ?? 3} galleries`, media: ImagesIcon })
  }
})
