// Every public URL from Sanity, for prerendering (NUXT_RENDER_MODE=hybrid|static).
// The crawler only finds pages that something links to, so the full list comes
// from the Content Lake. Mirrors SITEMAP_QUERY in app/utils/queries.ts.
const ROUTES_QUERY = `{
  "pages": *[_type == "page" && defined(slug.current)].slug.current,
  "collections": *[_type == "collection" && defined(slug.current)].slug.current,
  "entries": *[_type == "entry" && defined(slug.current) && defined(collection->slug.current)]{
    "path": "/" + collection->slug.current + "/" + slug.current
  }.path
}`

interface RoutesResult {
  pages: string[]
  collections: string[]
  entries: string[]
}

export async function getSanityRoutes(projectId: string, dataset: string, apiVersion: string) {
  if (!projectId) return []
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', ROUTES_QUERY)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load routes from Sanity: ${response.status} ${response.statusText}`)
  const { result } = await response.json() as { result: RoutesResult }
  return [
    ...result.pages.map(slug => (slug === 'home' ? '/' : `/${slug}`)),
    ...result.collections.map(slug => `/${slug}`),
    ...result.entries
  ]
}
