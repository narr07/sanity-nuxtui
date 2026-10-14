import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { iconField, imageField } from '../shared/fields'

// Singleton: registered in `document.singletons` in sanity.config.ts.
export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'header', title: 'Header' },
    { name: 'footer', title: 'Footer' }
  ],
  fields: [
    defineField({ name: 'title', title: 'Site name', type: 'string', group: 'general', validation: rule => rule.required() }),
    defineField({ name: 'description', title: 'Default description', type: 'text', rows: 3, group: 'general', description: 'Used when a page has no meta description' }),
    { ...imageField('logo', 'Logo', []), group: 'general', description: 'Optional. The site name is shown when empty.' },
    { ...imageField('ogImage', 'Default social share image'), group: 'general' },
    defineField({ name: 'navigation', title: 'Navigation', type: 'array', of: [{ type: 'link' }], group: 'header' }),
    defineField({ name: 'headerLinks', title: 'Header buttons', type: 'array', of: [{ type: 'link' }], group: 'header', validation: rule => rule.max(2) }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({
        name: 'column',
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Heading', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'links', title: 'Links', type: 'array', of: [{ type: 'link' }] })
        ],
        preview: { select: { title: 'label', links: 'links' }, prepare: ({ title, links }) => ({ title, subtitle: `${links?.length ?? 0} links` }) }
      })],
      validation: rule => rule.max(4)
    }),
    defineField({ name: 'footerText', title: 'Footer text', type: 'string', group: 'footer', description: 'Defaults to "© <year> <site name>"' }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({
        name: 'social',
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'url', title: 'URL', type: 'url', validation: rule => rule.required() }),
          { ...iconField(), description: 'e.g. i-simple-icons-x, i-simple-icons-instagram', validation: rule => rule.required() }
        ],
        preview: { select: { title: 'label', subtitle: 'url' } }
      })]
    })
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' })
  }
})
