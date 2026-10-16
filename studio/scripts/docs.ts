/**
 * Imports the guides in /docs into the "Docs" collection (served at /docs).
 *
 *   npm run docs:import            # creates or updates one entry per Markdown file
 *   npm run docs:import -- --prune    # also deletes entries whose file was removed
 *
 * See scripts/lib/docs.ts for the front matter, and scripts/lib/markdown.ts for
 * the Markdown that is supported.
 */
import { resolve } from 'node:path'
import { getCliClient } from 'sanity/cli'
import { importDocs } from './lib/docs'

const client = getCliClient({ apiVersion: '2026-10-01' })
const { projectId, dataset } = client.config()
console.log(`Importing docs into ${projectId}/${dataset}`)

importDocs(client, resolve(process.cwd(), '../docs'), { prune: process.argv.includes('--prune') }).catch((error) => {
  console.error(error)
  process.exit(1)
})
