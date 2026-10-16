import { defineConfig, type InitialValueResolverContext } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { documentInternationalization, type PluginCallbackArgs } from '@sanity/document-internationalization'
import { schemaTypes } from './schemaTypes'
import { ALL_ENTRY_FIELDS } from './schemaTypes/shared/entry-fields'
import { API_VERSION, getLanguages, LOCALIZED_TYPES } from './schemaTypes/shared/language'
import { resolve } from './presentation/resolve'
import { structure } from './structure'

// The site Presentation opens. `sanity dev` reads it from .env, `sanity deploy`
// from .env.production, so the hosted Studio previews the live site.
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// A translated entry is a copy of the original, so it still points at the
// original's collection. Move it to the collection's translation in the same
// language, when there is one.
async function moveEntryToTranslatedCollection({ newDocument, destinationLanguageId, client }: PluginCallbackArgs) {
  const collectionId = (newDocument.collection as { _ref?: string } | undefined)?._ref
  if (newDocument._type !== 'entry' || !collectionId) return
  const translatedId = await client.fetch<string | null>(
    '*[_type == "translation.metadata" && references($id)][0].translations[language == $language][0].value._ref',
    { id: collectionId, language: destinationLanguageId }
  )
  if (translatedId && translatedId !== collectionId) {
    await client.patch(newDocument._id).set({ collection: { _type: 'reference', _ref: translatedId } }).commit()
  }
}

export default defineConfig({
  name: 'default',
  title: 'Sanity × Nuxt UI',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      // A local dev server can be previewed from the hosted Studio too: type its
      // URL in the Presentation address bar
      allowOrigins: [previewUrl, 'http://localhost:*'],
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable'
        }
      }
    }),
    // Translations: one document per language, linked by a metadata document.
    // Languages come from Site Settings → Languages.
    documentInternationalization({
      supportedLanguages: client => getLanguages(client.withConfig({ apiVersion: API_VERSION })),
      schemaTypes: LOCALIZED_TYPES,
      apiVersion: API_VERSION,
      callback: moveEntryToTranslatedCollection
    }),
    codeInput(),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
    templates: prev => [
      ...prev,
      {
        id: 'entry-in-collection',
        title: 'Entry in collection',
        schemaType: 'entry',
        parameters: [{ name: 'collectionId', type: 'string' }],
        // New entries start with the fields and the language of their collection
        value: async ({ collectionId }: { collectionId: string }, { getClient }: InitialValueResolverContext) => {
          const collection = await getClient({ apiVersion: API_VERSION }).fetch<{ entryFields: string[] | null, language: string | null } | null>(
            '*[_id == $id][0]{ entryFields, "language": coalesce(language, *[_id == "settings"][0].language, "en") }',
            { id: collectionId }
          )
          return {
            collection: { _type: 'reference', _ref: collectionId },
            language: collection?.language ?? undefined,
            sections: collection?.entryFields ?? ALL_ENTRY_FIELDS
          }
        }
      }
    ]
  },

  document: {
    singletons: [{ documentId: 'settings', schemaType: 'settings', title: 'Site Settings' }]
  }
})
