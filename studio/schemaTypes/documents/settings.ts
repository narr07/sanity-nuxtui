import { defineArrayMember, defineField, defineType, type SanityDocumentLike } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { iconField, imageField } from '../shared/fields'
import { LANGUAGE_TAG, languageName } from '../shared/language'

// Singleton: registered in `document.singletons` in sanity.config.ts.
// With "Multiple languages" on, each extra language gets its own copy with the
// ID "settings-<language>" (see structure.ts). Copies only hold translated text:
// empty fields fall back to the main settings, and site-wide fields are hidden.
export const SETTINGS_TRANSLATION_PREFIX = 'settings-'

export function settingsTranslationLanguage(document: SanityDocumentLike | undefined) {
  const id = document?._id.replace(/^drafts\./, '') ?? ''
  return id.startsWith(SETTINGS_TRANSLATION_PREFIX) ? id.slice(SETTINGS_TRANSLATION_PREFIX.length) : undefined
}

const hiddenOnTranslations = ({ document }: { document?: SanityDocumentLike }) => !!settingsTranslationLanguage(document)

// Interface text written by the template (not by content). Placeholders show the
// English default used when a field is empty.
const LABELS: { name: string, title: string, placeholder: string, description?: string }[] = [
  { name: 'onThisPage', title: 'Table of contents heading', placeholder: 'On this page' },
  { name: 'relatedEntries', title: 'Related entries heading', placeholder: 'Related {entries}', description: '{entries} is replaced by the plural entry name of the collection, e.g. "posts"' },
  { name: 'tags', title: 'Tags label', placeholder: 'Tags' },
  { name: 'allTags', title: '"All" tag filter', placeholder: 'All' },
  { name: 'photos', title: 'Photo count', placeholder: '{count} photos', description: '{count} is replaced by the number of photos' },
  { name: 'emptyTitle', title: 'Empty collection title', placeholder: 'Nothing here yet' },
  { name: 'emptyDescription', title: 'Empty collection text', placeholder: 'Entries added to this collection will show up here.' },
  { name: 'emptyTagTitle', title: 'No entries with a tag: title', placeholder: 'Nothing tagged here yet' },
  { name: 'emptyTagDescription', title: 'No entries with a tag: text', placeholder: 'No entries are tagged "{tag}".', description: '{tag} is replaced by the selected tag' },
  { name: 'showAll', title: '"Show all" button', placeholder: 'Show all' },
  { name: 'gallery', title: 'Photo viewer title', placeholder: 'Gallery' },
  { name: 'openImage', title: 'Open photo (screen readers)', placeholder: 'Open image {number}', description: '{number} is replaced by the photo number' },
  { name: 'language', title: 'Language menu (screen readers)', placeholder: 'Language' },
  { name: 'notTranslated', title: 'Page not translated yet', placeholder: 'This page is not available in {language} yet.', description: '{language} is replaced by the name of the language' },
  { name: 'notFound', title: 'Page not found', placeholder: 'Page not found' },
  { name: 'backHome', title: 'Back to home button', placeholder: 'Back to home' }
]

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'header', title: 'Header' },
    { name: 'footer', title: 'Footer' },
    { name: 'languages', title: 'Languages', hidden: hiddenOnTranslations },
    { name: 'labels', title: 'Interface text' }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site name',
      type: 'string',
      group: 'general',
      validation: rule => rule.custom((value, { document }) => !!value || !!settingsTranslationLanguage(document) || 'Required')
    }),
    defineField({ name: 'description', title: 'Default description', type: 'text', rows: 3, group: 'general', description: 'Used when a page has no meta description' }),
    { ...imageField('logo', 'Logo', []), group: 'general', hidden: hiddenOnTranslations, description: 'Optional. The site name is shown when empty.' },
    {
      ...imageField('ogImage', 'Default social share image'),
      group: 'general',
      hidden: hiddenOnTranslations,
      description: 'Optional. When empty, every page gets a generated image with its title in the site theme.'
    },
    defineField({ name: 'navigation', title: 'Navigation', type: 'array', of: [{ type: 'link' }], group: 'header' }),
    defineField({ name: 'headerLinks', title: 'Header buttons', type: 'array', of: [{ type: 'link' }], group: 'header', validation: rule => rule.max(2) }),
    defineField({
      name: 'search',
      title: 'Search',
      type: 'boolean',
      group: 'header',
      hidden: hiddenOnTranslations,
      initialValue: true,
      description: 'A search button in the header (also Ctrl/⌘ + K). Finds pages, collections and entries in the language being viewed.'
    }),
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
      hidden: hiddenOnTranslations,
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
    }),
    defineField({
      name: 'language',
      title: 'Site language',
      type: 'string',
      group: 'languages',
      hidden: hiddenOnTranslations,
      description: 'Language tag of the main language, e.g. "en", "id" or "pt-BR". Its pages have no prefix in the URL (/about).',
      initialValue: 'en',
      validation: rule => rule.required().regex(LANGUAGE_TAG, { name: 'language tag' })
    }),
    defineField({
      name: 'multilingual',
      title: 'Multiple languages',
      type: 'boolean',
      group: 'languages',
      hidden: hiddenOnTranslations,
      initialValue: false,
      description: 'Translate pages, collections, entries and these settings into other languages. Reload the Studio after changing this.'
    }),
    defineField({
      name: 'languages',
      title: 'Other languages',
      type: 'array',
      group: 'languages',
      hidden: ({ document }) => hiddenOnTranslations({ document }) || !document?.multilingual,
      description: 'Language tags, e.g. "id" or "fr". Each is served under its own prefix (/id/about) and gets a language switcher entry. Reload the Studio after changing this.',
      of: [defineArrayMember({ type: 'string', validation: rule => rule.regex(LANGUAGE_TAG, { name: 'language tag' }) })],
      options: { layout: 'tags' },
      validation: rule => rule.unique()
    }),
    defineField({
      name: 'fallback',
      title: 'Show untranslated pages in the site language',
      type: 'boolean',
      group: 'languages',
      hidden: ({ document }) => hiddenOnTranslations({ document }) || !document?.multilingual,
      initialValue: true,
      description: 'On: /id/pricing shows the page in the site language, with the menus of the other language and a short note. Links stay in the language of the visitor. Off: such URLs do not exist, and the language switcher leads to the homepage of that language.'
    }),
    defineField({
      name: 'labels',
      title: 'Interface text',
      type: 'object',
      group: 'labels',
      description: 'Text written by the site itself rather than by content. Empty fields use the text of the main language, then the English default shown in grey.',
      options: { collapsible: false },
      fields: LABELS.map(label => defineField({ type: 'string', ...label }))
    })
  ],
  preview: {
    select: { id: '_id' },
    prepare: ({ id }) => {
      const language = settingsTranslationLanguage({ _id: id, _type: 'settings' })
      return { title: language ? `Site Settings (${languageName(language)})` : 'Site Settings' }
    }
  }
})
