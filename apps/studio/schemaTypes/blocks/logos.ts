import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'
import { iconField, imageField } from '../shared/fields'

// UPageLogos
export const logos = defineType({
  name: 'logos',
  title: 'Logo Cloud',
  type: 'object',
  icon: ImagesIcon,
  description: 'Row of client, partner or technology logos',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'marquee', title: 'Scrolling marquee', type: 'boolean', initialValue: false }),
    defineField({
      name: 'items',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({
        name: 'logo',
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string', validation: rule => rule.required() }),
          { ...iconField(), description: 'Use an icon (e.g. i-simple-icons-github) or upload an image below' },
          imageField()
        ],
        validation: rule => rule.custom((value: { icon?: string, image?: { asset?: unknown } } | undefined) =>
          value?.icon || value?.image?.asset ? true : 'Add an icon or an image'
        ),
        preview: { select: { title: 'name', subtitle: 'icon', media: 'image' } }
      })]
    })
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({ title: title || 'Logo Cloud', subtitle: `Logo Cloud · ${items?.length ?? 0} logos`, media: ImagesIcon })
  }
})
