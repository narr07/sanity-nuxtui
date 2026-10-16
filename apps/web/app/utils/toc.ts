import { stegaClean } from '@sanity/client/stega'

interface PortableTextBlock {
  _key?: string
  _type: string
  style?: string
  children?: { text?: string }[]
}

// Same shape as the links UContentToc expects (TocLink from @nuxt/content,
// which this project does not install)
export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

export interface Heading {
  key: string
  id: string
  text: string
  depth: 2 | 3
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

// H2 and H3 headings of a Portable Text body, with unique ids for anchors.
// PortableText.vue uses the same ids, so TOC links and headings always match.
export function getHeadings(body: PortableTextBlock[] | null | undefined): Heading[] {
  const used = new Map<string, number>()
  const headings: Heading[] = []
  for (const block of body ?? []) {
    if (block._type !== 'block' || (block.style !== 'h2' && block.style !== 'h3') || !block._key) continue
    const text = stegaClean(block.children?.map(child => child.text ?? '').join('') ?? '').trim()
    if (!text) continue
    const base = slugify(text)
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    headings.push({ key: block._key, id: count ? `${base}-${count + 1}` : base, text, depth: block.style === 'h2' ? 2 : 3 })
  }
  return headings
}

// UContentToc links: H3s are nested under the H2 before them
export function getTocLinks(headings: Heading[]): TocLink[] {
  const links: TocLink[] = []
  for (const { id, text, depth } of headings) {
    const parent = links.at(-1)
    if (depth === 3 && parent) {
      parent.children = [...(parent.children ?? []), { id, text, depth }]
    } else {
      links.push({ id, text, depth })
    }
  }
  return links
}
