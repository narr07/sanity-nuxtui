import { defineArrayMember, defineField, defineType, type SlugValidationContext } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { ALL_ENTRY_FIELDS, ENTRY_FIELDS, usesField } from '../shared/entry-fields'
import { imageField } from '../shared/fields'
import { API_VERSION, languageField, languagePrefix } from '../shared/language'

const SITE_LANGUAGE = '*[_id == "settings"][0].language, "en"'

// Slugs only need to be unique inside their collection: /blog/intro and
// /projects/intro can both exist.
async function isUniqueInCollection(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context
  const collectionId = (document?.collection as { _ref?: string } | undefined)?._ref
  if (!document || !collectionId) return true
  const id = document._id.replace(/^drafts\./, '')
  return !(await getClient({ apiVersion: API_VERSION }).fetch<boolean>(
    `defined(*[_type == "entry" && slug.current == $slug && collection._ref == $collectionId && !(_id in [$id, $draftId])][0]._id)`,
    { slug, collectionId, id, draftId: `drafts.${id}` }
  ))
}

// One item of a collection: a blog post, a gallery, a project, … Every field
// except title, slug and collection is optional, so the same type works for
// articles (body), galleries (photos) and designed pages (blocks).
export const entry = defineType({
  name: 'entry',
  title: 'Entry',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Photos', hidden: ({ document }) => !usesField(document, 'images') },
    { name: 'blocks', title: 'Blocks', hidden: ({ document }) => !usesField(document, 'blocks') },
    { name: 'meta', title: 'Meta' },
    { name: 'seo', title: 'SEO' }
  ],
  fields: [
    languageField,
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      group: ['content', 'meta'],
      description: 'Collections in the language of this entry',
      options: {
        disableNew: true,
        // Documents created before languages were turned on have no language:
        // they belong to the site language
        filter: ({ document }) => ({
          filter: `coalesce(language, ${SITE_LANGUAGE}) == coalesce($language, ${SITE_LANGUAGE})`,
          params: { language: document.language ?? null }
        })
      },
      validation: rule => rule.required()
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: rule => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'The entry URL: /<collection>/<slug>',
      options: { source: 'title', maxLength: 96, isUnique: isUniqueInCollection },
      validation: rule => rule.required().custom((slug) => {
        const value = slug?.current
        return !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase letters, numbers and dashes'
      })
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on cards and used as the default meta description',
      validation: rule => rule.max(240)
    }),
    { ...imageField('coverImage', 'Cover image'), group: 'content', description: 'Shown on cards and at the top of the entry' },
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
      description: 'Rich text: headings, lists, links, images, callouts and code',
      hidden: ({ document }) => !usesField(document, 'body')
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      group: 'media',
      hidden: ({ document }) => !usesField(document, 'images'),
      description: 'Optional photo gallery, shown as a grid with a lightbox. Drag and drop several files to upload them at once.',
      options: { layout: 'grid' },
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption', type: 'string' })
        ]
      })]
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'pageBuilder',
      group: 'blocks',
      hidden: ({ document }) => !usesField(document, 'blocks'),
      description: 'Optional page-builder blocks shown after the body and photos'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      group: 'meta',
      hidden: ({ document }) => !usesField(document, 'authors'),
      of: [{ type: 'reference', to: [{ type: 'author' }] }]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      description: 'Lowercase keywords, used for filtering and related entries',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array',
      group: 'meta',
      hidden: ({ document }) => !usesField(document, 'details'),
      description: 'Key facts shown on the entry, e.g. Client: Acme, Year: 2026, Role: Design',
      of: [defineArrayMember({
        name: 'detail',
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'value', title: 'Value', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'url', title: 'Link (optional)', type: 'url', validation: rule => rule.uri({ scheme: ['http', 'https', 'mailto'] }) })
        ],
        preview: { select: { title: 'label', subtitle: 'value' } }
      })]
    }),
    defineField({
      name: 'sections',
      title: 'Fields on this entry',
      type: 'array',
      group: 'meta',
      description: 'Copied from the collection when the entry is created. Turn on a field to use it on this entry only.',
      of: [{ type: 'string' }],
      options: { list: ENTRY_FIELDS, layout: 'grid' },
      initialValue: ALL_ENTRY_FIELDS
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'meta',
      description: 'Only used when the collection sorts by manual order. Lower numbers come first.'
    }),
    defineField({
      name: 'group',
      title: 'Sidebar group',
      type: 'string',
      group: 'meta',
      description: 'Docs layout: entries with the same group are listed together in the sidebar, e.g. "Get started" or "Developer guide".'
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' })
  ],
  orderings: [
    { title: 'Newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ],
  preview: {
    select: {
      title: 'title',
      collection: 'collection.title',
      date: 'publishedAt',
      cover: 'coverImage',
      photo: 'images.0',
      language: 'language'
    },
    prepare: ({ title, collection, date, cover, photo, language }) => ({
      title,
      subtitle: languagePrefix(language) + [collection, date ? new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : null].filter(Boolean).join(' · '),
      media: cover ?? photo
    })
  }
})
