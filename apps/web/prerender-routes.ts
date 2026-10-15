// Every public URL from Sanity in every language, for prerendering
// (NUXT_RENDER_MODE=hybrid|static). The crawler only finds pages that something
// links to, so the full list comes from the Content Lake. Paths are built by the
// same GROQ as the site (PATH in app/utils/queries.ts).
import { PATH } from './app/utils/queries'

const LANGUAGES_QUERY = '*[_id == "settings"][0]{ "defaultLanguage": coalesce(language, "en"), "languages": select(multilingual == true => languages, []) }'

const ROUTES_QUERY = `*[
  _type in ["page", "collection", "entry"]
  && defined(slug.current)
  && (_type != "entry" || defined(collection->slug.current))
  && coalesce(language, $defaultLanguage) in $languages
]{ "path": ${PATH} }.path`

async function query<T>(projectId: string, dataset: string, apiVersion: string, groq: string, params: Record<string, unknown> = {}) {
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', groq)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value))
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load routes from Sanity: ${response.status} ${response.statusText}`)
  return (await response.json() as { result: T }).result
}

export async function getSanityRoutes(projectId: string, dataset: string, apiVersion: string) {
  if (!projectId) return []
  const settings = await query<{ defaultLanguage: string, languages: string[] | null } | null>(projectId, dataset, apiVersion, LANGUAGES_QUERY)
  const defaultLanguage = settings?.defaultLanguage ?? 'en'
  const languages = [defaultLanguage, ...(settings?.languages ?? [])]
  const paths = await query<(string | null)[]>(projectId, dataset, apiVersion, ROUTES_QUERY, { defaultLanguage, languages })
  return [...new Set(paths.filter((path): path is string => !!path))]
}
