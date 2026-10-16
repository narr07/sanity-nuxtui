/**
 * Imports the Markdown guides in /docs (repo root) into a "Docs" collection
 * with the docs layout, served at /docs. Each file becomes an entry; running it
 * again updates the entries with the same slug, so the files stay the source.
 *
 * Front matter of each file:
 *   title: Install the template      (required)
 *   description: One-line summary    (the entry excerpt)
 *   group: Developer guide           (sidebar group)
 *   order: 210                       (sidebar position, lower first)
 * The slug is the file name: developer-guide/installation.md → /docs/installation
 */
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import type { SanityClient } from 'sanity'
import { parse } from 'yaml'
import { markdownToBlocks } from './markdown'

interface FrontMatter {
  title?: string
  description?: string
  group?: string
  order?: number
}

const COLLECTION = {
  _type: 'collection',
  title: 'Docs',
  slug: { _type: 'slug', current: 'docs' },
  description: 'How to edit this site and how to build on the template: guides for editors and developers.',
  entryLabel: 'Guide',
  layout: 'docs',
  sort: 'manual',
  entryFields: ['body'],
  toc: true,
  tagFilter: false,
  showRelated: false
}

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const path = join(directory, item.name)
    if (item.isDirectory()) return markdownFiles(path)
    return item.name.endsWith('.md') && item.name !== 'README.md' ? [path] : []
  })
}

function readGuide(path: string) {
  const source = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  const meta = (match ? parse(match[1]!) : {}) as FrontMatter
  if (!meta.title) throw new Error(`${path}: front matter needs a title`)
  // The H1 repeats the title on GitHub; the site shows the title already
  const body = (match ? match[2]! : source).replace(/^\s*#\s.*\n+/, '')
  return { slug: basename(path, '.md'), meta, body }
}

export async function importDocs(client: SanityClient, docsDirectory: string, { prune = false } = {}) {
  const language = (await client.fetch<string | null>('*[_id == "settings"][0].language')) || 'en'
  const inLanguage = 'coalesce(language, $language) == $language'

  let collectionId = await client.fetch<string | null>(
    `*[_type == "collection" && slug.current == "docs" && ${inLanguage}][0]._id`, { language })
  if (!collectionId) {
    collectionId = (await client.create({ ...COLLECTION, language }))._id
    console.log('  created collection: Docs')
  }

  const existing = await client.fetch<{ _id: string, slug: string }[]>(
    `*[_type == "entry" && collection._ref == $collectionId]{ _id, "slug": slug.current }`, { collectionId })
  const files = markdownFiles(docsDirectory).map(readGuide)
  const slugs = new Set(files.map(file => file.slug))

  const tx = client.transaction()
  for (const { slug, meta, body } of files) {
    const fields = {
      title: meta.title,
      excerpt: meta.description,
      group: meta.group,
      order: meta.order,
      sections: ['body'],
      language,
      // Links between files point at their pages on the site
      body: markdownToBlocks(body, { resolveLink: href => href.replace(/^(?:\.{1,2}\/)*(?:[\w-]+\/)*([\w-]+)\.md(#.*)?$/, '/docs/$1$2') })
    }
    const current = existing.find(entry => entry.slug === slug)
    if (current) tx.patch(current._id, patch => patch.set(fields))
    else tx.create({ _type: 'entry', collection: { _type: 'reference', _ref: collectionId }, slug: { _type: 'slug', current: slug }, ...fields })
  }
  const stale = existing.filter(entry => !slugs.has(entry.slug))
  if (prune) stale.forEach(entry => tx.delete(entry._id))
  await tx.commit()

  console.log(`  ${files.length} guides imported from ${relative(process.cwd(), docsDirectory) || '.'}`)
  if (stale.length && !prune) console.log(`  ${stale.length} entries have no file anymore (${stale.map(entry => entry.slug).join(', ')}); run with --prune to delete them`)
  return collectionId
}
