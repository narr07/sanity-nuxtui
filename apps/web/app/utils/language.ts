// Languages come from Site Settings → Languages. The site language is served
// without a prefix (/about), every other language under its tag (/id/about).
export interface LanguageConfig {
  defaultLanguage: string
  /** Every language the site serves, the site language first */
  languages: string[]
  /** Untranslated pages are shown in the site language under every prefix */
  fallback: boolean
}

export const DEFAULT_LANGUAGE_CONFIG: LanguageConfig = { defaultLanguage: 'en', languages: ['en'], fallback: true }

// "/id/blog/post" → { language: "id", parts: ["blog", "post"], prefixed: true }
export function splitLanguagePath(path: string, config: LanguageConfig) {
  const parts = path.split('/').filter(Boolean).map(part => decodeURIComponent(part))
  const first = parts[0]
  if (first && config.languages.includes(first)) {
    return { language: first, parts: parts.slice(1), prefixed: true }
  }
  return { language: config.defaultLanguage, parts, prefixed: false }
}

// "/" in "id" → "/id", "/blog" in "id" → "/id/blog"
export function localePath(path: string, language: string, config: LanguageConfig) {
  if (language === config.defaultLanguage) return path
  return path === '/' ? `/${language}` : `/${language}${path}`
}

// "id" → "Bahasa Indonesia", written in the language itself
export function languageName(code: string) {
  try {
    const name = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code
    return name.charAt(0).toLocaleUpperCase(code) + name.slice(1)
  } catch {
    return code
  }
}
