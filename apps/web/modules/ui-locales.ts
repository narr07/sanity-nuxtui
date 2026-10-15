import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { addTemplate, addTypeTemplate, defineNuxtModule, resolvePath } from 'nuxt/kit'

// Nuxt UI translates its own text (close buttons, carousel arrows, …) through
// locales. Languages are picked in Sanity at runtime, so this writes one lazy
// import per locale to #build/ui-locales: a page only downloads its own locale,
// not all of them as `import * from '@nuxt/ui/locale'` would.
export default defineNuxtModule({
  meta: { name: 'ui-locales' },
  async setup() {
    const directory = dirname(await resolvePath('@nuxt/ui/runtime/locale/en.js'))
    const files = readdirSync(directory).filter(file => /^[a-z_]+\.js$/.test(file) && file !== 'index.js')

    addTemplate({
      filename: 'ui-locales.mjs',
      getContents: () => [
        'export const uiLocales = {',
        // de_at.js → "de-at"
        ...files.map(file => `  ${JSON.stringify(file.slice(0, -3).replace('_', '-'))}: () => import('@nuxt/ui/runtime/locale/${file}'),`),
        '}'
      ].join('\n')
    })

    addTypeTemplate({
      filename: 'types/ui-locales.d.ts',
      getContents: () => [
        'declare module \'#build/ui-locales.mjs\' {',
        '  import type { Locale, Messages } from \'@nuxt/ui\'',
        '  export const uiLocales: Record<string, () => Promise<{ default: Locale<Messages> }>>',
        '}'
      ].join('\n')
    })
  }
})
