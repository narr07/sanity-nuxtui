import { defineField, defineType } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'
import { anchorField, headerFields, iconField, imageField, linksField, orientationField, reverseField } from '../shared/fields'

// UPageSection with a features list and an optional image
export const section = defineType({
  name: 'section',
  title: 'Features Section',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Section with a heading, a list of features with icons, and an optional image',
  fields: [
    anchorField,
    iconField(),
    ...headerFields,
    linksField,
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'featureItem' }] }),
    imageField(),
    orientationField(),
    reverseField
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Untitled', subtitle: 'Features Section', media: media ?? BlockElementIcon })
  }
})
