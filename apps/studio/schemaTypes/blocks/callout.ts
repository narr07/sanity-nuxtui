import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons/InfoOutline'
import { COLORS, iconField, linksField } from '../shared/fields'

// UAlert inside a UContainer
export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  icon: InfoOutlineIcon,
  description: 'Short notice or announcement with optional buttons',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    iconField(),
    { ...linksField, title: 'Actions' },
    defineField({ name: 'color', title: 'Color', type: 'string', options: { list: [...COLORS] }, initialValue: 'primary' }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['solid', 'outline', 'soft', 'subtle'] },
      initialValue: 'subtle'
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `Callout · ${subtitle}` : 'Callout', media: InfoOutlineIcon })
  }
})
