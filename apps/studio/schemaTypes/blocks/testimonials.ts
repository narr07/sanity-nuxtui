import { defineArrayMember, defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons/Comment'
import { anchorField, headerFields, imageField } from '../shared/fields'

// UPageSection > UPageColumns > UPageCard + UUser
export const testimonials = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  description: 'Quotes from customers in a masonry layout',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({
        name: 'testimonial',
        type: 'object',
        fields: [
          defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: rule => rule.required() }),
          defineField({ name: 'name', title: 'Name', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'role', title: 'Role / company', type: 'string' }),
          imageField('avatar', 'Photo')
        ],
        preview: { select: { title: 'name', subtitle: 'quote', media: 'avatar' } }
      })]
    })
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({ title: title || 'Testimonials', subtitle: `Testimonials · ${items?.length ?? 0} quotes`, media: CommentIcon })
  }
})
