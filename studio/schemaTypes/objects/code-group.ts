import { defineArrayMember, defineField, defineType } from 'sanity'
import { CodeBlockIcon } from '@sanity/icons/CodeBlock'
import { codeOptions } from '../shared/code'

// Several code blocks shown as tabs (ProseCodeGroup), e.g. pnpm / npm / yarn
// or a component and its config. Each tab is labelled with its file name.
export const codeGroup = defineType({
  name: 'codeGroup',
  title: 'Code group',
  type: 'object',
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      description: 'The file name is the tab label, e.g. "pnpm", "nuxt.config.ts"',
      of: [defineArrayMember({ type: 'code', options: codeOptions })],
      validation: rule => rule.min(2).max(8)
    })
  ],
  preview: {
    select: { tabs: 'tabs' },
    prepare: ({ tabs }: { tabs?: { filename?: string, language?: string }[] }) => ({
      title: 'Code group',
      subtitle: tabs?.map(tab => tab.filename || tab.language).filter(Boolean).join(' · ') || 'No tabs',
      media: CodeBlockIcon
    })
  }
})
