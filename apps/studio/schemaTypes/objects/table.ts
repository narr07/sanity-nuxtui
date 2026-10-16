import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons/ThList'

// A simple table in rich text, rendered with the Nuxt UI prose table. The first
// row is the header. Cells are plain text with two shortcuts: `backticks` for
// code and **asterisks** for bold.
export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'The first row is the header. In cells, wrap text in `backticks` for code and **asterisks** for bold.',
      of: [defineArrayMember({
        name: 'row',
        type: 'object',
        fields: [defineField({ name: 'cells', title: 'Cells', type: 'array', of: [{ type: 'string' }] })],
        preview: {
          select: { cells: 'cells' },
          prepare: ({ cells }: { cells?: string[] }) => ({ title: cells?.join(' · ') || 'Empty row' })
        }
      })],
      validation: rule => rule.min(2)
    })
  ],
  preview: {
    select: { rows: 'rows' },
    prepare: ({ rows }: { rows?: { cells?: string[] }[] }) => ({
      title: 'Table',
      subtitle: rows?.[0]?.cells?.join(' · ') ?? 'Empty',
      media: ThListIcon
    })
  }
})
