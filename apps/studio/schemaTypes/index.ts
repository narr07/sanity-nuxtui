import { author } from './documents/author'
import { gallery } from './documents/gallery'
import { page } from './documents/page'
import { post } from './documents/post'
import { settings } from './documents/settings'
import { blockContent } from './objects/block-content'
import { featureItem } from './objects/feature-item'
import { link } from './objects/link'
import { pageBuilder } from './objects/page-builder'
import { seo } from './objects/seo'
import { callout } from './blocks/callout'
import { cardGrid } from './blocks/card-grid'
import { cta } from './blocks/cta'
import { faq } from './blocks/faq'
import { galleryList } from './blocks/gallery-list'
import { hero } from './blocks/hero'
import { imageGallery } from './blocks/image-gallery'
import { logos } from './blocks/logos'
import { postList } from './blocks/post-list'
import { pricing } from './blocks/pricing'
import { richText } from './blocks/rich-text'
import { section } from './blocks/section'
import { testimonials } from './blocks/testimonials'
import { timeline } from './blocks/timeline'

export const schemaTypes = [
  // Documents
  page,
  post,
  author,
  gallery,
  settings,
  // Objects
  blockContent,
  featureItem,
  link,
  pageBuilder,
  seo,
  // Page builder blocks
  callout,
  cardGrid,
  cta,
  faq,
  galleryList,
  hero,
  imageGallery,
  logos,
  postList,
  pricing,
  richText,
  section,
  testimonials,
  timeline
]
