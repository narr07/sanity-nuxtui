import { defineField, defineType } from 'sanity'
import { imageField } from '../shared/fields'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  description: 'Optional. Falls back to the document title and excerpt. Without an image, a social image is generated from the title.',
  fields: [
    defineField({ name: 'title', title: 'Meta title', type: 'string', validation: rule => rule.max(60).warning('Keep it under 60 characters') }),
    defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: rule => rule.max(160).warning('Keep it under 160 characters') }),
    imageField('image', 'Social share image'),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false })
  ]
})
