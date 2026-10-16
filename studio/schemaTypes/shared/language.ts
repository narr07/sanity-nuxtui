import { defineField, type SanityClient, type SanityDocumentLike, type SlugValidationContext } from 'sanity'

export const API_VERSION = '2026-10-01'

// Document types translated with @sanity/document-internationalization: each
// language is its own document, linked by a `translation.metadata` document.
export const LOCALIZED_TYPES = ['page', 'collection', 'entry']

// Language tags such as "en", "id", "pt-BR" (IETF BCP 47)
export const LANGUAGE_TAG = /^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/

interface LanguageSettings {
  language?: string
  multilingual?: boolean
  languages?: string[]
}

const LANGUAGE_SETTINGS_QUERY = '*[_id == "settings"][0]{ language, multilingual, languages }'

// "id" → "Indonesian"
export function languageName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code
  } catch {
    return code
  }
}

export async function getDefaultLanguage(client: SanityClient) {
  const settings = await client.fetch<LanguageSettings | null>(LANGUAGE_SETTINGS_QUERY)
  return settings?.language || 'en'
}

// The site language first, then the other languages when "Multiple languages"
// is on in Site Settings. Read once when the Studio loads.
export async function getLanguages(client: SanityClient) {
  const settings = await client.fetch<LanguageSettings | null>(LANGUAGE_SETTINGS_QUERY)
  const defaultLanguage = settings?.language || 'en'
  const others = settings?.multilingual ? (settings.languages ?? []).filter(code => code !== defaultLanguage) : []
  return [defaultLanguage, ...new Set(others)].map(id => ({ id, title: languageName(id) }))
}

// Set by the Translations menu; new documents start in the site language
export const languageField = defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  readOnly: true,
  hidden: true,
  initialValue: async (_params, { getClient }) => getDefaultLanguage(getClient({ apiVersion: API_VERSION }))
})

// Documents created before languages were turned on have no `language`: they
// belong to the site language. Mirrors IN_LANGUAGE in the web app's queries.
export const IN_LANGUAGE = 'coalesce(language, $defaultLanguage) == $language'

export async function documentLanguage(document: SanityDocumentLike | undefined, client: SanityClient) {
  const defaultLanguage = await getDefaultLanguage(client)
  return { language: (document?.language as string | undefined) || defaultLanguage, defaultLanguage }
}

// Slugs only need to be unique within one language: /about and /id/about can
// share the slug "about".
export async function isUniqueInLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context
  if (!document) return true
  const client = getClient({ apiVersion: API_VERSION })
  const id = document._id.replace(/^drafts\./, '')
  const params = { ...(await documentLanguage(document, client)), slug, type: document._type, id, draftId: `drafts.${id}` }
  return !(await client.fetch<boolean>(
    `defined(*[_type == $type && slug.current == $slug && ${IN_LANGUAGE} && !(_id in [$id, $draftId])][0]._id)`,
    params
  ))
}

// Preview subtitle prefix: "ID · " for documents in a language other than the site language
export function languagePrefix(language: string | undefined) {
  return language ? `${language.toUpperCase()} · ` : ''
}
