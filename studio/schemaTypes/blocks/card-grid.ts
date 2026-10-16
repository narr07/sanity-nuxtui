import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThLargeIcon } from '@sanity/icons/ThLarge'
import { anchorField, COLORS, headerFields, iconField, imageField } from '../shared/fields'

// UPageSection > UPageGrid > UPageCard
export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Card Grid',
  type: 'object',
  icon: ThLargeIcon,
  description: 'Grid of cards with icon or image, each optionally linking somewhere',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [defineArrayMember({
        name: 'card',
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          iconField(),
          imageField(),
          defineField({ name: 'link', title: 'Link', type: 'link', description: 'Only the destination is used; the whole card becomes clickable' }),
          defineField({ name: 'spotlight', title: 'Spotlight effect', type: 'boolean', initialValue: false }),
          defineField({ name: 'highlight', title: 'Highlight', type: 'boolean', initialValue: false }),
          defineField({ name: 'highlightColor', title: 'Highlight color', type: 'string', options: { list: [...COLORS] }, hidden: ({ parent }) => !parent?.highlight })
        ],
        preview: { select: { title: 'title', subtitle: 'description', media: 'image' } }
      })]
    }),
    defineField({
      name: 'variant',
      title: 'Card variant',
      type: 'string',
      options: { list: ['outline', 'solid', 'soft', 'subtle', 'ghost', 'naked'] },
      initialValue: 'outline'
    })
  ],
  preview: {
    select: { title: 'title', cards: 'cards' },
    prepare: ({ title, cards }) => ({ title: title || 'Untitled', subtitle: `Card Grid · ${cards?.length ?? 0} cards`, media: ThLargeIcon })
  }
})
