import { stegaClean } from '@sanity/client/stega'

// Fixed locale and time zone so server and client render the same string.
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

// Good enough for collection labels such as "post", "entry", "case study"
export function plural(word: string) {
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`
  if (/(s|x|z|ch|sh)$/i.test(word)) return `${word}es`
  return `${word}s`
}

export function formatDate(value: string | null | undefined) {
  const clean = stegaClean(value)
  return clean ? dateFormatter.format(new Date(clean)) : undefined
}
