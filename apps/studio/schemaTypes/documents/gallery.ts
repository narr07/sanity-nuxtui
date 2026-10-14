import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'

// Photo galleries: rendered by the /gallery/[slug] template in Nuxt.
export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  icon: ImagesIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' }
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: rule => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The gallery URL: /gallery/<slug>',
      options: { source: 'title', maxLength: 96 },
      validation: rule => rule.required()
    }),
    defineField({ name: 'date', title: 'Date', type: 'date', group: 'content' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content' }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      group: 'content',
      description: 'The first photo is used as the cover. Drag and drop several files at once to upload them in bulk.',
      options: { layout: 'grid' },
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption', type: 'string' })
        ]
      })],
      validation: rule => rule.min(1).required()
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' })
  ],
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'title', images: 'images', media: 'images.0' },
    prepare: ({ title, images, media }) => ({
      title,
      subtitle: `${images?.length ?? 0} photos`,
      media
    })
  }
})
