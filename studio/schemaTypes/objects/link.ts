import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons/Link'
import { COLORS, iconField } from '../shared/fields'

// Maps to Nuxt UI ButtonProps (UButton, and `links` on UPageHero/UPageSection/UPageCTA).
export const link = defineType({
  name: 'link',
  title: 'Button / Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [{ title: 'Internal content', value: 'internal' }, { title: 'URL', value: 'external' }],
        layout: 'radio',
        direction: 'horizontal'
      },
      initialValue: 'internal'
    }),
    defineField({
      name: 'page',
      title: 'Page, collection or entry',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'collection' }, { type: 'entry' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal'
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Full URL (https://…), anchor (#features), route (/blog) or mailto:/tel: link',
      hidden: ({ parent }) => parent?.linkType !== 'external'
    }),
    defineField({ name: 'newTab', title: 'Open in new tab', type: 'boolean', initialValue: false }),
    iconField('icon', 'Leading icon'),
    iconField('trailingIcon', 'Trailing icon'),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: { list: [...COLORS] },
      initialValue: 'primary'
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] },
      initialValue: 'solid'
    })
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
      slug: 'page.slug.current',
      refType: 'page._type',
      collectionSlug: 'page.collection.slug.current',
      variant: 'variant'
    },
    prepare: ({ label, href, slug, refType, collectionSlug, variant }) => {
      const prefix = refType === 'entry' ? `/${collectionSlug}/` : '/'
      const path = slug === 'home' && refType === 'page' ? '/' : slug ? `${prefix}${slug}` : href
      return {
        title: label || 'Untitled link',
        subtitle: [path, variant].filter(Boolean).join(' · ')
      }
    }
  }
})
