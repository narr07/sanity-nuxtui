import { defineArrayMember, defineType } from 'sanity'

// The blocks editors can add to a page. To add a new block: create its schema in
// blocks/, register it here and in schemaTypes/index.ts, then create
// Block<Name>.vue in apps/web/app/components/blocks/ and add it to PageBlocks.vue.
export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page blocks',
  type: 'array',
  of: [
    defineArrayMember({ type: 'hero' }),
    defineArrayMember({ type: 'logos' }),
    defineArrayMember({ type: 'section' }),
    defineArrayMember({ type: 'cardGrid' }),
    defineArrayMember({ type: 'timeline' }),
    defineArrayMember({ type: 'imageGallery' }),
    defineArrayMember({ type: 'richText' }),
    defineArrayMember({ type: 'testimonials' }),
    defineArrayMember({ type: 'faq' }),
    defineArrayMember({ type: 'pricing' }),
    defineArrayMember({ type: 'cta' }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({ type: 'collectionList' })
  ],
  options: {
    insertMenu: {
      filter: 'auto',
      groups: [
        { name: 'intro', title: 'Intro', of: ['hero', 'logos'] },
        { name: 'content', title: 'Content', of: ['section', 'cardGrid', 'timeline', 'imageGallery', 'richText'] },
        { name: 'social-proof', title: 'Social proof', of: ['testimonials', 'faq'] },
        { name: 'conversion', title: 'Conversion', of: ['pricing', 'cta', 'callout'] },
        { name: 'dynamic', title: 'Dynamic lists', of: ['collectionList'] }
      ],
      views: [{ name: 'list' }, { name: 'grid' }]
    }
  }
})
