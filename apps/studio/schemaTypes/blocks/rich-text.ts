import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons/Text'

// Portable Text inside a narrow UContainer
export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  icon: TextIcon,
  description: 'Free-form text with headings, lists, links, images, callouts and code',
  fields: [
    defineField({ name: 'body', title: 'Body', type: 'blockContent' })
  ],
  preview: {
    select: { body: 'body' },
    prepare: ({ body }) => {
      const first = body?.find((b: { _type: string }) => b._type === 'block')
      const text = first?.children?.map((c: { text?: string }) => c.text).join('') || 'Empty'
      return { title: text, subtitle: 'Rich Text', media: TextIcon }
    }
  }
})
