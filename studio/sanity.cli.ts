import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  // Sanity hosting (pnpm deploy:studio). The first deploy prints the app ID:
  // put it in SANITY_STUDIO_APP_ID so later deploys go to the same studio.
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID || undefined,
    autoUpdates: true
  },
  typegen: {
    path: '../frontend/app/**/*.{ts,vue}',
    schema: 'schema.json',
    generates: '../frontend/sanity.types.ts'
  }
})
