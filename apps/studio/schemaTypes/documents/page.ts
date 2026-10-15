import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons/Document'

// Flexible pages built from blocks. The page with slug "home" is served at "/".
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' }
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: rule => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Use "home" for the homepage (/). Nested paths like "company/team" are supported. Collection slugs (e.g. "blog") are taken.',
      options: { source: 'title', maxLength: 96 },
      validation: rule => rule.required().custom(async (slug, context) => {
        const value = slug?.current
        if (!value) return true
        if (!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers, dashes and slashes'
        const client = context.getClient({ apiVersion: '2026-10-01' })
        const taken = await client.fetch<number>('count(*[_type == "collection" && slug.current == $slug])', { slug: value })
        return taken ? `The collection at /${value} already uses this slug` : true
      })
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'pageBuilder',
      group: 'content',
      description: 'Add, reorder and edit the sections of this page'
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' })
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', blocks: 'blocks' },
    prepare: ({ title, slug, blocks }) => ({
      title,
      subtitle: `${slug === 'home' ? '/' : `/${slug ?? ''}`} · ${blocks?.length ?? 0} blocks`
    })
  }
})
