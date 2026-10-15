import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { resolve } from './presentation/resolve'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'Sanity × Nuxt UI',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable'
        }
      }
    }),
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
        value: ({ collectionId }: { collectionId: string }) => ({
          collection: { _type: 'reference', _ref: collectionId }
        })
      }
    ]
  },

  document: {
    singletons: [{ documentId: 'settings', schemaType: 'settings', title: 'Site Settings' }]
  }
})
