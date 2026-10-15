import { defineField, defineType } from 'sanity'
import { FolderIcon } from '@sanity/icons/Folder'
import { ALL_ENTRY_FIELDS, ENTRY_FIELDS } from '../shared/entry-fields'

const API_VERSION = '2026-10-01'

// A collection groups entries under one URL: a collection with slug "projects"
// lists its entries at /projects, and each entry lives at /projects/<entry-slug>.
// Editors can create new collections (Blog, Projects, Services, …) without code.
export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: FolderIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display' },
    { name: 'seo', title: 'SEO' }
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', description: 'e.g. "Blog", "Projects", "Services"', validation: rule => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The list URL. "projects" → /projects, and entries at /projects/<entry-slug>',
      options: { source: 'title', maxLength: 64 },
      validation: rule => rule.required().custom(async (slug, context) => {
        const value = slug?.current
        if (!value) return true
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers and dashes (no slashes)'
        if (value === 'home') return '"home" is reserved for the homepage'
        const client = context.getClient({ apiVersion: API_VERSION })
        const taken = await client.fetch<number>('count(*[_type == "page" && slug.current == $slug])', { slug: value })
        return taken ? `A page already uses the slug "${value}"` : true
      })
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content', description: 'Shown under the title on the list page' }),
    defineField({
      name: 'entryLabel',
      title: 'Entry name',
      type: 'string',
      group: 'content',
      description: 'Singular name of one entry, e.g. "Post", "Project". Used for labels such as "Related posts".',
      initialValue: 'Entry'
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks below the list',
      type: 'pageBuilder',
      group: 'content',
      description: 'Optional. For example a call to action under the list.'
    }),
    defineField({
      name: 'layout',
      title: 'List layout',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Blog: date, excerpt, authors', value: 'blog' },
          { title: 'Cards: cover image and excerpt', value: 'cards' },
          { title: 'Gallery: photo tiles with photo count', value: 'gallery' }
        ],
        layout: 'radio'
      },
      initialValue: 'cards',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'sort',
      title: 'Sort entries by',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Newest first', value: 'newest' },
          { title: 'Oldest first', value: 'oldest' },
          { title: 'Title (A–Z)', value: 'title' },
          { title: 'Manual order (the "Order" field on each entry)', value: 'manual' }
        ],
        layout: 'radio'
      },
      initialValue: 'newest'
    }),
    defineField({
      name: 'entryFields',
      title: 'Entry fields',
      type: 'array',
      group: 'display',
      description: 'Fields new entries in this collection use. Unused fields and tabs are hidden. Each entry can still change this under Meta.',
      of: [{ type: 'string' }],
      options: { list: ENTRY_FIELDS, layout: 'grid' },
      initialValue: ALL_ENTRY_FIELDS
    }),
    defineField({ name: 'tagFilter', title: 'Show tag filter', type: 'boolean', group: 'display', initialValue: false, description: 'Lets visitors filter the list by tag' }),
    defineField({
      name: 'toc',
      title: 'Show table of contents',
      type: 'boolean',
      group: 'display',
      initialValue: false,
      description: 'Lists the headings of the entry body next to it, highlighting the one being read. Shown on entries with at least two headings.'
    }),
    defineField({ name: 'showRelated', title: 'Show related entries', type: 'boolean', group: 'display', initialValue: false, description: 'Shows up to three entries with a shared tag under each entry' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' })
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', layout: 'layout' },
    prepare: ({ title, slug, layout }) => ({ title, subtitle: `/${slug ?? ''} · ${layout ?? 'cards'}` })
  }
})
