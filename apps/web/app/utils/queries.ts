import { defineQuery } from 'groq'

// Languages (Site Settings → Languages). Pages, collections and entries have a
// `language`; documents created before languages were turned on have none and
// belong to the site language. Queries take these parameters:
//   $language         the language of the current URL
//   $defaultLanguage  the site language, served without a URL prefix
//   $languages        every language the site serves
//   $fallback         show untranslated pages in the site language (/id/pricing);
//                     links to untranslated pages then stay in the current language
// Fragments end in `as const`: useSanityQuery finds a query's result type by its
// exact text, which only survives as a literal type.
export const IN_LANGUAGE = /* groq */ `coalesce(language, $defaultLanguage) == $language` as const

// Untranslated documents shown in another language when $fallback is on
const AS_FALLBACK = /* groq */ `($fallback && coalesce(language, $defaultLanguage) == $defaultLanguage)` as const

// Entries in the same language as the document in the parent scope (a collection or entry)
const SAME_LANGUAGE = /* groq */ `coalesce(language, $defaultLanguage) == coalesce(^.language, $defaultLanguage)` as const

// URL prefix of the document in scope: "/id" for other languages, "" for the site language
const OWN_PREFIX = /* groq */ `select(coalesce(language, $defaultLanguage) != $defaultLanguage => "/" + language, "")` as const

// The same, but with $fallback on, site-language documents take the current prefix
const VIEW_PREFIX = /* groq */ `select(
  coalesce(language, $defaultLanguage) != $defaultLanguage => "/" + language,
  $fallback && $language != $defaultLanguage => "/" + string($language),
  ""
)` as const

// URL of the page, collection or entry in scope: /about, /id/about, /blog/post, /id (homepage)
export const PATH = /* groq */ `select(
  _type == "page" && slug.current == "home" => select(${OWN_PREFIX} == "" => "/", ${OWN_PREFIX}),
  _type == "entry" => ${OWN_PREFIX} + "/" + collection->slug.current + "/" + slug.current,
  ${OWN_PREFIX} + "/" + slug.current
)` as const

// The same URL as seen from the current page: with $fallback on, untranslated
// documents keep the language of the visitor (/id/pricing instead of /pricing)
const VIEW_PATH = /* groq */ `select(
  _type == "page" && slug.current == "home" => select(${VIEW_PREFIX} == "" => "/", ${VIEW_PREFIX}),
  _type == "entry" => ${VIEW_PREFIX} + "/" + collection->slug.current + "/" + slug.current,
  ${VIEW_PREFIX} + "/" + slug.current
)` as const

// The document a reference field points at, or its translation in the current
// language. Links and lists can point at one language and still follow the visitor.
const translated = <F extends string>(field: F) => /* groq */ `coalesce(*[_type == "translation.metadata" && references(^.${field}._ref)][0].translations[language == $language][0].value->, ${field}->)` as const

// Every language version of the document in scope, for hreflang and the language switcher
export const TRANSLATIONS = /* groq */ `*[_type == "translation.metadata" && references(^._id)][0].translations[language in $languages]{
  language,
  "path": value->{ "path": ${PATH} }.path
}[defined(path)]` as const

// A document of `type` in the current language, or in the site language with $fallback on
const find = <T extends string, F extends string>(type: T, filter: F) => /* groq */ `coalesce(
  *[_type == "${type}" && ${filter} && ${IN_LANGUAGE}][0],
  *[_type == "${type}" && ${filter} && ${AS_FALLBACK}][0]
)` as const

// Resolves a `link` object to Nuxt UI ButtonProps-ready data. Internal links
// become paths in the current language when the target has a translation.
const LINK = /* groq */ `{
  _key,
  label,
  newTab,
  icon,
  trailingIcon,
  color,
  variant,
  "to": select(
    linkType == "internal" => (${translated('page')}){ "path": ${VIEW_PATH} }.path,
    href
  )
}` as const

// Images carry their low-quality placeholder (a tiny base64 image) from the asset metadata
const IMAGE = /* groq */ `{
  ...,
  "lqip": asset->metadata.lqip
}` as const

// Rich text with image placeholders and resolved links in callouts
const BODY = /* groq */ `{
  ...,
  _type == "image" => { "lqip": asset->metadata.lqip },
  _type == "callout" => { links[]${LINK} }
}` as const

const AUTHOR = /* groq */ `{
  _id,
  name,
  role,
  avatar
}` as const

// Everything a card needs, whatever the collection layout
const ENTRY_CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  "path": ${VIEW_PATH},
  publishedAt,
  excerpt,
  "cover": coalesce(coverImage, images[0])${IMAGE},
  "imageCount": count(images),
  tags,
  order,
  group,
  authors[]->${AUTHOR}
}` as const

// Page-builder blocks, with links and dynamic lists resolved
const BLOCKS = /* groq */ `{
  ...,
  links[]${LINK},
  defined(image) => { image${IMAGE} },
  defined(images) => { images[]${IMAGE} },
  _type == "cardGrid" => { cards[]{ ..., image${IMAGE}, link${LINK} } },
  _type == "pricing" => { plans[]{ ..., button${LINK} } },
  _type == "collectionList" => {
    link${LINK},
    "collection": (${translated('collection')}){
      title,
      "slug": slug.current,
      layout,
      sort,
      "entries": *[_type == "entry" && collection._ref == ^._id && defined(slug.current) && ${SAME_LANGUAGE} && (!defined(^.^.tag) || ^.^.tag in tags)]
        | order(publishedAt desc)[0...100]${ENTRY_CARD}
    }
  },
  _type == "richText" => { body[]${BODY} }
}` as const

// One query per URL: /<path> is a page or a collection, /<parent>/<child> may be
// an entry. Pages win when a page and an entry share a path. $path is the URL
// without the language prefix. `language` tells a fallback (site language) apart.
// `docs` lists every entry of a docs-layout collection (sidebar, previous/next).
export const ROUTE_QUERY = defineQuery(`{
  "page": (${find('page', 'slug.current == $path')}){
    _id,
    _type,
    "language": coalesce(language, $defaultLanguage),
    title,
    seo,
    blocks[]${BLOCKS},
    "translations": ${TRANSLATIONS}
  },
  "collection": (${find('collection', 'slug.current == $path')}){
    _id,
    _type,
    "language": coalesce(language, $defaultLanguage),
    title,
    "slug": slug.current,
    "path": ${VIEW_PATH},
    description,
    entryLabel,
    layout,
    sort,
    tagFilter,
    seo,
    blocks[]${BLOCKS},
    "entries": *[_type == "entry" && collection._ref == ^._id && defined(slug.current) && ${SAME_LANGUAGE}] | order(publishedAt desc)${ENTRY_CARD},
    "translations": ${TRANSLATIONS}
  },
  "entry": (${find('entry', 'slug.current == $child && collection->slug.current == $parent')}){
    _id,
    _type,
    "language": coalesce(language, $defaultLanguage),
    title,
    "slug": slug.current,
    "path": ${VIEW_PATH},
    publishedAt,
    _updatedAt,
    excerpt,
    coverImage${IMAGE},
    images[]${IMAGE},
    tags,
    details,
    sections,
    seo,
    "collection": collection->{ title, "slug": slug.current, "path": ${VIEW_PATH}, layout, entryLabel, showRelated, tagFilter, toc, "translations": ${TRANSLATIONS} },
    "docs": select(collection->layout == "docs" => *[_type == "entry" && collection._ref == ^.collection._ref && defined(slug.current) && ${SAME_LANGUAGE}]
      | order(coalesce(order, 9999) asc, title asc){ _id, title, excerpt, group, "path": ${VIEW_PATH} }),
    authors[]->${AUTHOR},
    body[]${BODY},
    blocks[]${BLOCKS},
    "related": *[_type == "entry" && collection._ref == ^.collection._ref && _id != ^._id && ${SAME_LANGUAGE} && count(tags[@ in ^.^.tags]) > 0]
      | order(publishedAt desc)[0...3]${ENTRY_CARD},
    "translations": ${TRANSLATIONS}
  }
}`)

// The site language and the other languages, when "Multiple languages" is on
export const LANGUAGES_QUERY = defineQuery(`*[_id == "settings"][0]{
  "defaultLanguage": coalesce(language, "en"),
  "languages": select(multilingual == true => languages, []),
  "fallback": fallback != false
}`)

// A field from the settings of the current language ("settings-<language>",
// see $translationId), falling back to the main settings when it is empty.
const setting = <F extends string>(field: F) => /* groq */ `coalesce(*[_id == $translationId][0].${field}, ${field})` as const

export const SETTINGS_QUERY = defineQuery(`*[_id == "settings"][0]{
  "title": ${setting('title')},
  "description": ${setting('description')},
  logo,
  ogImage,
  "navigation": (${setting('navigation')})[]${LINK},
  "headerLinks": (${setting('headerLinks')})[]${LINK},
  "footerColumns": (${setting('footerColumns')})[]{
    _key,
    label,
    links[]${LINK}
  },
  "footerText": ${setting('footerText')},
  socialLinks,
  labels,
  "translatedLabels": *[_id == $translationId][0].labels,
  "search": search != false
}`)

// Every public URL in every language, for /sitemap.xml (server/api/__sitemap__/urls.ts)
export const SITEMAP_QUERY = defineQuery(`*[
  _type in ["page", "collection", "entry"]
  && defined(slug.current)
  && (_type != "entry" || defined(collection->slug.current))
  && coalesce(language, $defaultLanguage) in $languages
  && seo.noIndex != true
]{
  "path": ${PATH},
  _updatedAt,
  "translations": ${TRANSLATIONS}
}`)

// Site search (components/SiteSearch.vue). $terms holds one "word*" pattern per
// word, all of which must match. Covers the current language and, with
// $fallback on, untranslated pages shown in it.
export const SEARCH_QUERY = defineQuery(`*[
  _type in ["page", "collection", "entry"]
  && defined(slug.current)
  && (_type != "entry" || defined(collection->slug.current))
  && seo.noIndex != true
  && (
    ${IN_LANGUAGE}
    || (${AS_FALLBACK} && !defined(*[_type == "translation.metadata" && references(^._id)][0].translations[language == $language][0]))
  )
  && (title match $terms || excerpt match $terms || description match $terms || pt::text(body) match $terms || blocks[].title match $terms || blocks[].description match $terms)
]
| score(
  boost(title match $terms, 5),
  boost(excerpt match $terms, 2),
  boost(description match $terms, 2),
  pt::text(body) match $terms,
  blocks[].title match $terms,
  blocks[].description match $terms
)
| order(_score desc)[0...10]{
  _id,
  _type,
  title,
  "path": ${VIEW_PATH},
  "description": coalesce(excerpt, description, seo.description),
  "collection": collection->title
}`)
