import { defineQuery } from 'groq'

// Resolves a `link` object to Nuxt UI ButtonProps-ready data. Internal references
// become paths: pages → /<slug>, collections → /<slug>, entries → /<collection>/<slug>.
const LINK = /* groq */ `{
  _key,
  label,
  newTab,
  icon,
  trailingIcon,
  color,
  variant,
  "to": select(
    linkType == "internal" => select(
      page->_type == "entry" => "/" + page->collection->slug.current + "/" + page->slug.current,
      page->_type == "page" && page->slug.current == "home" => "/",
      "/" + page->slug.current
    ),
    href
  )
}`

const AUTHOR = /* groq */ `{
  _id,
  name,
  role,
  avatar
}`

// Everything a card needs, whatever the collection layout
const ENTRY_CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  "path": "/" + collection->slug.current + "/" + slug.current,
  publishedAt,
  excerpt,
  "cover": coalesce(coverImage, images[0]),
  "imageCount": count(images),
  tags,
  order,
  authors[]->${AUTHOR}
}`

// Page-builder blocks, with links and dynamic lists resolved
const BLOCKS = /* groq */ `{
  ...,
  links[]${LINK},
  _type == "cardGrid" => { cards[]{ ..., link${LINK} } },
  _type == "pricing" => { plans[]{ ..., button${LINK} } },
  _type == "collectionList" => {
    link${LINK},
    "collection": collection->{ title, "slug": slug.current, layout, sort },
    "entries": *[_type == "entry" && collection._ref == ^.collection._ref && defined(slug.current) && (!defined(^.tag) || ^.tag in tags)]
      | order(publishedAt desc)[0...100]${ENTRY_CARD}
  },
  _type == "richText" => {
    body[]{
      ...,
      _type == "callout" => { links[]${LINK} }
    }
  }
}`

// One query per URL: /<path> is a page or a collection, /<parent>/<child> may be
// an entry. Pages win when a page and an entry share a path.
export const ROUTE_QUERY = defineQuery(`{
  "page": *[_type == "page" && slug.current == $path][0]{
    _id,
    _type,
    title,
    seo,
    blocks[]${BLOCKS}
  },
  "collection": *[_type == "collection" && slug.current == $path][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    entryLabel,
    layout,
    sort,
    tagFilter,
    seo,
    blocks[]${BLOCKS},
    "entries": *[_type == "entry" && collection._ref == ^._id && defined(slug.current)] | order(publishedAt desc)${ENTRY_CARD}
  },
  "entry": *[_type == "entry" && slug.current == $child && collection->slug.current == $parent][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    excerpt,
    coverImage,
    images,
    tags,
    details,
    seo,
    "collection": collection->{ title, "slug": slug.current, entryLabel, showRelated, tagFilter },
    authors[]->${AUTHOR},
    body[]{
      ...,
      _type == "callout" => { links[]${LINK} }
    },
    blocks[]${BLOCKS},
    "related": *[_type == "entry" && collection._ref == ^.collection._ref && _id != ^._id && count(tags[@ in ^.^.tags]) > 0]
      | order(publishedAt desc)[0...3]${ENTRY_CARD}
  }
}`)

export const SETTINGS_QUERY = defineQuery(`*[_id == "settings"][0]{
  title,
  description,
  logo,
  ogImage,
  navigation[]${LINK},
  headerLinks[]${LINK},
  footerColumns[]{
    _key,
    label,
    links[]${LINK}
  },
  footerText,
  socialLinks
}`)

// Every public URL, for /sitemap.xml (see server/api/__sitemap__/urls.ts)
export const SITEMAP_QUERY = defineQuery(`{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "collections": *[_type == "collection" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "entries": *[_type == "entry" && defined(slug.current) && defined(collection->slug.current) && seo.noIndex != true]{
    "path": "/" + collection->slug.current + "/" + slug.current,
    _updatedAt
  }
}`)
