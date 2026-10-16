/**
 * Markdown → Portable Text for the blockContent type (schemaTypes/objects/block-content.ts).
 *
 * Supported:
 * - ## to #### headings, paragraphs, bullet and numbered lists (nested)
 * - **bold**, *italic*, `code`, [links](https://…). Links to other .md files
 *   become /docs/<file-name> (see `resolveLink`)
 * - fenced code with a language and an optional file name: ```ts [nuxt.config.ts]
 * - code groups (tabs): fences between <!-- code-group --> and <!-- /code-group -->
 * - GitHub alerts as callouts: > [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION].
 *   A **bold** first sentence becomes the callout title.
 * - tables, as the "table" type: cells keep `code` and **bold**, links keep their text
 *
 * The comments above are invisible on GitHub, so the same files read well there.
 */
import { randomUUID } from 'node:crypto'
import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'

type Block = Record<string, unknown> & { _type: string, _key: string }

interface Span {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

const md = new MarkdownIt({ html: true })
const key = () => randomUUID().replaceAll('-', '').slice(0, 12)

// Fence languages → the values offered by the code input (schemaTypes/shared/code.ts)
const LANGUAGES: Record<string, string> = {
  ts: 'typescript', typescript: 'typescript', js: 'javascript', javascript: 'javascript', vue: 'vue',
  html: 'html', css: 'css', scss: 'scss', json: 'json', sh: 'sh', bash: 'sh', shell: 'sh', env: 'sh',
  yaml: 'yaml', yml: 'yaml', md: 'markdown', markdown: 'markdown', groq: 'groq', sql: 'sql',
  python: 'python', php: 'php', text: 'text', txt: 'text'
}

const ALERTS: Record<string, { title: string, icon: string, color: string }> = {
  NOTE: { title: 'Note', icon: 'i-lucide-info', color: 'info' },
  TIP: { title: 'Tip', icon: 'i-lucide-lightbulb', color: 'primary' },
  IMPORTANT: { title: 'Important', icon: 'i-lucide-circle-alert', color: 'secondary' },
  WARNING: { title: 'Warning', icon: 'i-lucide-triangle-alert', color: 'warning' },
  CAUTION: { title: 'Caution', icon: 'i-lucide-octagon-alert', color: 'error' }
}

export interface MarkdownOptions {
  /** Turns a link target into a site URL, e.g. "./installation.md" → "/docs/installation" */
  resolveLink?: (href: string) => string
}

function codeBlock(token: Token) {
  // "ts [nuxt.config.ts]" → language "typescript", file name "nuxt.config.ts"
  const [, lang = '', filename] = token.info.trim().match(/^(\S*)\s*(?:\[(.+)\])?/) ?? []
  return {
    _type: 'code',
    _key: key(),
    language: LANGUAGES[lang.toLowerCase()] ?? 'text',
    code: token.content.replace(/\n$/, ''),
    ...(filename ? { filename } : {})
  }
}

function inline(token: Token, options: MarkdownOptions) {
  const children: Span[] = []
  const markDefs: Record<string, unknown>[] = []
  const marks: string[] = []
  const push = (text: string, extra: string[] = []) => {
    if (!text) return
    const all = [...marks, ...extra]
    const last = children.at(-1)
    if (last && last.marks.join() === all.join()) last.text += text
    else children.push({ _type: 'span', _key: key(), text, marks: all })
  }
  for (const child of token.children ?? []) {
    switch (child.type) {
      case 'text': push(child.content); break
      case 'code_inline': push(child.content, ['code']); break
      case 'softbreak': push(' '); break
      case 'hardbreak': push('\n'); break
      case 'strong_open': marks.push('strong'); break
      case 'em_open': marks.push('em'); break
      case 's_open': marks.push('strike-through'); break
      case 'strong_close': case 'em_close': case 's_close': marks.pop(); break
      case 'link_open': {
        const href = child.attrGet('href') ?? ''
        const markKey = key()
        const external = /^https?:\/\//.test(href)
        markDefs.push({ _type: 'link', _key: markKey, href: external ? href : (options.resolveLink?.(href) ?? href), newTab: external })
        marks.push(markKey)
        break
      }
      case 'link_close': marks.pop(); break
    }
  }
  return { children: children.length ? children : [{ _type: 'span' as const, _key: key(), text: '', marks: [] }], markDefs }
}

// Plain text of an inline token: markup removed, link text kept
function plainText(source: string) {
  return source
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function callout(source: string): Block | undefined {
  const match = source.match(/^\[!(\w+)\]\s*([\s\S]*)$/)
  const alert = match && ALERTS[match[1]!.toUpperCase()]
  if (!match || !alert) return undefined
  const rest = match[2]!.trim()
  // "**Keep the token on the server.** The read token…" → title + description
  const titled = rest.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/)
  const title = titled ? titled[1]!.replace(/[.:]$/, '') : alert.title
  const description = plainText(titled ? titled[2]! : rest)
  return {
    _type: 'callout',
    _key: key(),
    title,
    ...(description ? { description } : {}),
    icon: alert.icon,
    color: alert.color,
    variant: 'subtle'
  }
}

export function markdownToBlocks(markdown: string, options: MarkdownOptions = {}): Block[] {
  const tokens = md.parse(markdown, {})
  const blocks: Block[] = []
  const lists: ('bullet' | 'number')[] = []
  let group: ReturnType<typeof codeBlock>[] | undefined

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]!
    switch (token.type) {
      case 'heading_open': {
        const level = Math.min(4, Math.max(2, Number(token.tag.slice(1))))
        blocks.push({ _type: 'block', _key: key(), style: `h${level}`, ...inline(tokens[index + 1]!, options) })
        index += 2
        break
      }
      case 'paragraph_open': {
        const content = inline(tokens[index + 1]!, options)
        blocks.push(lists.length
          ? { _type: 'block', _key: key(), style: 'normal', listItem: lists.at(-1), level: lists.length, ...content }
          : { _type: 'block', _key: key(), style: 'normal', ...content })
        index += 2
        break
      }
      case 'bullet_list_open': lists.push('bullet'); break
      case 'ordered_list_open': lists.push('number'); break
      case 'bullet_list_close': case 'ordered_list_close': lists.pop(); break
      case 'fence': {
        const code = codeBlock(token)
        if (group) group.push(code)
        else blocks.push(code)
        break
      }
      case 'html_block': {
        const comment = token.content.trim()
        if (comment === '<!-- code-group -->') group = []
        if (comment === '<!-- /code-group -->' && group) {
          blocks.push({ _type: 'codeGroup', _key: key(), tabs: group })
          group = undefined
        }
        break
      }
      case 'table_open': {
        // Rows of cells; the inline Markdown of each cell is kept for the renderer
        const rows: string[][] = []
        while (index < tokens.length - 1 && tokens[index]!.type !== 'table_close') {
          const next = tokens[++index]!
          if (next.type === 'tr_open') rows.push([])
          if (next.type === 'inline') rows.at(-1)?.push(next.content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'))
        }
        blocks.push({ _type: 'table', _key: key(), rows: rows.map(cells => ({ _type: 'row', _key: key(), cells })) })
        break
      }
      case 'blockquote_open': {
        // Collect the quote, then decide: GitHub alert → callout, else a quote block
        const inner: Token[] = []
        let depth = 1
        while (depth > 0 && index < tokens.length - 1) {
          const next = tokens[++index]!
          if (next.type === 'blockquote_open') depth++
          if (next.type === 'blockquote_close') depth--
          if (depth > 0) inner.push(next)
        }
        const inlines = inner.filter(item => item.type === 'inline')
        const alert = callout(inlines.map(item => item.content).join('\n'))
        if (alert) blocks.push(alert)
        else for (const item of inlines) blocks.push({ _type: 'block', _key: key(), style: 'blockquote', ...inline(item, options) })
        break
      }
    }
  }
  return blocks
}
