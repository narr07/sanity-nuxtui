import { defineQuery } from 'groq'

// Resolves a `link` object to Nuxt UI ButtonProps-ready data. Internal references
// are turned into paths based on their document type.
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
      page->_type == "post" => "/blog/" + page->slug.current,
      page->_type == "gallery" => "/gallery/" + page->slug.current,
      page->slug.current == "home" => "/",
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

const POST_CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage,
  tags,
  authors[]->${AUTHOR}
}`

const GALLERY_CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  date,
  description,
  "cover": images[0],
  "count": count(images)
}`

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  seo,
  blocks[]{
    ...,
    links[]${LINK},
    _type == "cardGrid" => { cards[]{ ..., link${LINK} } },
    _type == "pricing" => { plans[]{ ..., button${LINK} } },
    _type == "postList" => {
      link${LINK},
      "posts": *[_type == "post" && defined(slug.current) && (!defined(^.tag) || ^.tag in tags)]
        | order(publishedAt desc)[0...12]${POST_CARD}
    },
    _type == "galleryList" => {
      link${LINK},
      "galleries": *[_type == "gallery" && defined(slug.current)] | order(date desc, _createdAt desc)[0...12]${GALLERY_CARD}
    },
    _type == "richText" => {
      body[]{
        ...,
        _type == "callout" => { links[]${LINK} }
      }
    }
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

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)${POST_CARD}`)

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  _updatedAt,
  excerpt,
  coverImage,
  tags,
  authors[]->{ ..., links },
  body[]{
    ...,
    _type == "callout" => { links[]${LINK} }
  },
  seo,
  "related": *[_type == "post" && slug.current != ^.slug.current && count(tags[@ in ^.^.tags]) > 0]
    | order(publishedAt desc)[0...3]${POST_CARD}
}`)

export const GALLERIES_QUERY = defineQuery(`*[_type == "gallery" && defined(slug.current)] | order(date desc, _createdAt desc)${GALLERY_CARD}`)

export const GALLERY_QUERY = defineQuery(`*[_type == "gallery" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  date,
  description,
  images,
  seo
}`)

// Every public URL, for /sitemap.xml (see server/api/__sitemap__/urls.ts)
export const SITEMAP_QUERY = defineQuery(`{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "galleries": *[_type == "gallery" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt }
}`)
