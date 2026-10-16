// Interface text written by the site itself. Editors override it per language
// in Site Settings → Interface text; these English defaults fill the gaps.
export const DEFAULT_LABELS = {
  onThisPage: 'On this page',
  relatedEntries: 'Related {entries}',
  tags: 'Tags',
  allTags: 'All',
  photos: '{count} photos',
  emptyTitle: 'Nothing here yet',
  emptyDescription: 'Entries added to this collection will show up here.',
  emptyTagTitle: 'Nothing tagged here yet',
  emptyTagDescription: 'No entries are tagged "{tag}".',
  showAll: 'Show all',
  gallery: 'Gallery',
  openImage: 'Open image {number}',
  language: 'Language',
  notTranslated: 'This page is not available in {language} yet.',
  notFound: 'Page not found',
  backHome: 'Back to home'
}

export type Labels = typeof DEFAULT_LABELS
export type LabelKey = keyof Labels

type LabelOverrides = Partial<Record<LabelKey, string | null>> | null | undefined

// Main settings first, then the current language: later non-empty values win
export function mergeLabels(...overrides: LabelOverrides[]): Labels {
  const labels = { ...DEFAULT_LABELS }
  for (const override of overrides) {
    for (const [key, value] of Object.entries(override ?? {})) {
      if (key in labels && typeof value === 'string' && value.trim()) labels[key as LabelKey] = value
    }
  }
  return labels
}

// "Open image {number}" + { number: 3 } → "Open image 3"
export function fillLabel(text: string, values: Record<string, string | number> = {}) {
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match))
}
