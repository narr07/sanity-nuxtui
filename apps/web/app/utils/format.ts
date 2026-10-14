import { stegaClean } from '@sanity/client/stega'

// Fixed locale and time zone so server and client render the same string.
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

export function formatDate(value: string | null | undefined) {
  const clean = stegaClean(value)
  return clean ? dateFormatter.format(new Date(clean)) : undefined
}
