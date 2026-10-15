import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons/Document'
import { API_VERSION, documentLanguage, IN_LANGUAGE, isUniqueInLanguage, languageField, languagePrefix } from '../shared/language'

// Flexible pages built from blocks. The page with slug "home" is served at "/"
// (or "/<language>" for a translation).
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
    languageField,
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: rule => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Use "home" for the homepage (/). Nested paths like "company/team" are supported. Collection slugs (e.g. "blog") are taken.',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueInLanguage },
      validation: rule => rule.required().custom(async (slug, context) => {
        const value = slug?.current
        if (!value) return true
        if (!/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers, dashes and slashes'
        const client = context.getClient({ apiVersion: API_VERSION })
        const params = { ...(await documentLanguage(context.document, client)), slug: value }
        const taken = await client.fetch<number>(`count(*[_type == "collection" && slug.current == $slug && ${IN_LANGUAGE}])`, params)
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
    select: { title: 'title', slug: 'slug.current', blocks: 'blocks', language: 'language' },
    prepare: ({ title, slug, blocks, language }) => ({
      title,
      subtitle: `${languagePrefix(language)}${slug === 'home' ? '/' : `/${slug ?? ''}`} · ${blocks?.length ?? 0} blocks`
    })
  }
})
