import { defineArrayMember, defineField, defineType } from 'sanity'
import { ClockIcon } from '@sanity/icons/Clock'
import { anchorField, COLORS, headerFields, iconField } from '../shared/fields'

// UPageSection > UTimeline
export const timeline = defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  icon: ClockIcon,
  description: 'Milestones, history or a step-by-step process',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'items',
      title: 'Events',
      type: 'array',
      of: [defineArrayMember({
        name: 'event',
        type: 'object',
        fields: [
          defineField({ name: 'date', title: 'Date / label', type: 'string', description: 'Free text, e.g. "March 2024" or "Step 1"' }),
          defineField({ name: 'title', title: 'Title', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          iconField()
        ],
        preview: { select: { title: 'title', subtitle: 'date' } }
      })]
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation',
      type: 'string',
      options: { list: ['vertical', 'horizontal'], layout: 'radio', direction: 'horizontal' },
      initialValue: 'vertical'
    }),
    defineField({ name: 'color', title: 'Color', type: 'string', options: { list: [...COLORS] }, initialValue: 'primary' })
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({ title: title || 'Timeline', subtitle: `Timeline · ${items?.length ?? 0} events`, media: ClockIcon })
  }
})
