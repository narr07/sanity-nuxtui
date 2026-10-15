// @shikijs/core rather than shiki/core: the latter bundles the Oniguruma wasm
import { createHighlighterCore, type HighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Syntax highlighting for code blocks from Sanity. Runs on the server only, so
// Shiki never ships to the browser. Output uses CSS variables for light and dark
// themes (see main.css) and marks highlighted lines with `.line.highlight`.
//
// Edge friendly: the JavaScript regex engine needs no WebAssembly (not allowed on
// Cloudflare Workers) and only the languages below are bundled. To support another
// language, import it here and add it to the list in the Studio (schemaTypes/shared/code.ts).

// Language values from @sanity/code-input → Shiki ids
const ALIASES: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  js: 'javascript',
  md: 'markdown',
  mysql: 'sql',
  yml: 'yaml'
}

let highlighter: Promise<HighlighterCore> | undefined
const cache = new Map<string, string>()

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
    langs: [
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/jsx.mjs'),
      import('shiki/langs/vue.mjs'),
      import('shiki/langs/html.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/scss.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/markdown.mjs'),
      import('shiki/langs/sql.mjs'),
      import('shiki/langs/python.mjs'),
      import('shiki/langs/php.mjs'),
      import('shiki/langs/xml.mjs')
    ]
  })
  return highlighter
}

interface Body {
  code?: string
  language?: string
  highlightedLines?: number[]
}

export default defineEventHandler(async (event) => {
  const { code = '', language = 'text', highlightedLines = [] } = await readBody<Body>(event)
  const shiki = await getHighlighter()
  const requested = ALIASES[language] ?? language
  const lang = shiki.getLoadedLanguages().includes(requested) ? requested : 'text'

  const key = `${lang}:${highlightedLines.join(',')}:${code}`
  const cached = cache.get(key)
  if (cached !== undefined) return { html: cached }

  const html = shiki.codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    transformers: [{
      line(node, line) {
        if (highlightedLines.includes(line)) this.addClassToHast(node, 'highlight')
      }
    }]
  })

  // ProsePre renders its own <pre>, so keep only what is inside <code>. It also
  // makes every `.line` a block, so the newlines between lines would double the
  // spacing: drop them, and give empty lines a space so they keep their height.
  const inner = (html.match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1] ?? '')
    .replace(/<span class="line"><\/span>/g, '<span class="line"> </span>')
    .replace(/\n/g, '')
  if (cache.size > 500) cache.clear()
  cache.set(key, inner)
  return { html: inner }
})
