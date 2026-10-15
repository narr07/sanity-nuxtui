import type { Locale, Messages } from '@nuxt/ui'
import { uiLocales } from '#build/ui-locales.mjs'

// Nuxt UI locale for a language tag: "pt-BR" → pt_br, else pt, else any "pt-…", else English
export async function loadUiLocale(language: string): Promise<Locale<Messages>> {
  const code = language.toLowerCase()
  const base = code.split('-')[0]
  const loader = uiLocales[code]
    ?? uiLocales[base!]
    ?? Object.entries(uiLocales).find(([key]) => key.startsWith(`${base}-`))?.[1]
    ?? uiLocales.en!
  return (await loader()).default
}
