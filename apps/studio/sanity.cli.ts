import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  typegen: {
    path: '../web/app/**/*.{ts,vue}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts'
  }
})
