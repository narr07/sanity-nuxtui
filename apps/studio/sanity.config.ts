import { defineConfig, type InitialValueResolverContext } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemaTypes'
import { ALL_ENTRY_FIELDS } from './schemaTypes/shared/entry-fields'
import { resolve } from './presentation/resolve'
import { structure } from './structure'

// The site Presentation opens. `sanity dev` reads it from .env, `sanity deploy`
// from .env.production, so the hosted Studio previews the live site.
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

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
        // New entries start with the fields their collection uses
        value: async ({ collectionId }: { collectionId: string }, { getClient }: InitialValueResolverContext) => {
          const entryFields = await getClient({ apiVersion: '2026-10-01' })
            .fetch<string[] | null>('*[_id == $id][0].entryFields', { id: collectionId })
          return {
            collection: { _type: 'reference', _ref: collectionId },
            sections: entryFields ?? ALL_ENTRY_FIELDS
          }
        }
      }
    ]
  },

  document: {
    singletons: [{ documentId: 'settings', schemaType: 'settings', title: 'Site Settings' }]
  }
})
