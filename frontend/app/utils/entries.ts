import { stegaClean } from '@sanity/client/stega'
import type { CollectionSort, EntryCard } from '~/types/sanity'

// Sorts entries the way the collection is configured in Studio.
export function sortEntries<T extends Pick<EntryCard, 'title' | 'publishedAt' | 'order'>>(entries: T[], sort?: CollectionSort | null): T[] {
  const time = (entry: T) => (entry.publishedAt ? Date.parse(stegaClean(entry.publishedAt)) : 0)
  const sorted = [...entries]
  switch (stegaClean(sort)) {
    case 'oldest':
      return sorted.sort((a, b) => time(a) - time(b))
    case 'title':
      return sorted.sort((a, b) => stegaClean(a.title).localeCompare(stegaClean(b.title)))
    case 'manual':
      return sorted.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    default:
      return sorted.sort((a, b) => time(b) - time(a))
  }
}

export function hasTag(entry: Pick<EntryCard, 'tags'>, tag: string) {
  return entry.tags?.some(entryTag => stegaClean(entryTag) === tag) ?? false
}
