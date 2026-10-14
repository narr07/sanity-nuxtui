import { defineArrayMember, defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { anchorField, headerFields } from '../shared/fields'

// UPageSection > UAccordion
export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  description: 'Questions and answers in an accordion',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [defineArrayMember({
        name: 'question',
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: rule => rule.required() })
        ],
        preview: { select: { title: 'question', subtitle: 'answer' } }
      })]
    })
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({ title: title || 'FAQ', subtitle: `FAQ · ${items?.length ?? 0} questions`, media: HelpCircleIcon })
  }
})
