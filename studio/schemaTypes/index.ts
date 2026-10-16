import { author } from './documents/author'
import { collection } from './documents/collection'
import { entry } from './documents/entry'
import { page } from './documents/page'
import { settings } from './documents/settings'
import { blockContent } from './objects/block-content'
import { codeGroup } from './objects/code-group'
import { featureItem } from './objects/feature-item'
import { link } from './objects/link'
import { pageBuilder } from './objects/page-builder'
import { seo } from './objects/seo'
import { table } from './objects/table'
import { callout } from './blocks/callout'
import { cardGrid } from './blocks/card-grid'
import { collectionList } from './blocks/collection-list'
import { cta } from './blocks/cta'
import { faq } from './blocks/faq'
import { hero } from './blocks/hero'
import { imageGallery } from './blocks/image-gallery'
import { logos } from './blocks/logos'
import { pricing } from './blocks/pricing'
import { richText } from './blocks/rich-text'
import { section } from './blocks/section'
import { testimonials } from './blocks/testimonials'
import { timeline } from './blocks/timeline'

export const schemaTypes = [
  // Documents
  page,
  collection,
  entry,
  author,
  settings,
  // Objects
  blockContent,
  codeGroup,
  featureItem,
  link,
  pageBuilder,
  seo,
  table,
  // Page builder blocks
  callout,
  cardGrid,
  collectionList,
  cta,
  faq,
  hero,
  imageGallery,
  logos,
  pricing,
  richText,
  section,
  testimonials,
  timeline
]
