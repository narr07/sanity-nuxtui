import { defineField, defineType } from 'sanity'
import { FolderIcon } from '@sanity/icons/Folder'
import { anchorField, headerFields } from '../shared/fields'

// The latest entries of any collection, on any page. Uses the collection's
// layout (blog, cards or gallery) and sort order.
export const collectionList = defineType({
  name: 'collectionList',
  title: 'Collection List',
  type: 'object',
  icon: FolderIcon,
  description: 'Shows entries from a collection automatically, e.g. the latest posts or projects',
  fields: [
    defineField({ name: 'collection', title: 'Collection', type: 'reference', to: [{ type: 'collection' }], validation: rule => rule.required() }),
    anchorField,
    ...headerFields,
    defineField({
      name: 'limit',
      title: 'Number of entries',
      type: 'number',
      initialValue: 3,
      validation: rule => rule.min(1).max(24).integer()
    }),
    defineField({ name: 'tag', title: 'Only entries tagged', type: 'string', description: 'Optional. Leave empty to show all entries.' }),
    defineField({ name: 'link', title: '"View all" button', type: 'link', description: 'Optional. Usually links to the collection itself.' })
  ],
  preview: {
    select: { title: 'title', collection: 'collection.title', limit: 'limit' },
    prepare: ({ title, collection, limit }) => ({
      title: title || collection || 'Collection List',
      subtitle: `Collection List · ${limit ?? 3} from ${collection ?? '—'}`,
      media: FolderIcon
    })
  }
})
