import { defineField, defineType } from 'sanity'
import { BulbFilledIcon } from '@sanity/icons/BulbFilled'
import { imageField, linksField, orientationField, reverseField } from '../shared/fields'

// UPageCTA
export const cta = defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  icon: BulbFilledIcon,
  description: 'Highlighted box that asks the visitor to take an action',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    linksField,
    imageField(),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['outline', 'solid', 'soft', 'subtle', 'naked'] },
      initialValue: 'subtle'
    }),
    orientationField(),
    reverseField
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Untitled', subtitle: 'Call to Action', media: media ?? BulbFilledIcon })
  }
})
