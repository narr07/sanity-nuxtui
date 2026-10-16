// Optional entry fields a collection can switch on or off. A collection picks its
// defaults ("Entry fields"); each new entry copies them into its own "sections"
// field, which hides the unused fields and tabs in the Studio and on the site.
export const ENTRY_FIELDS = [
  { title: 'Body (rich text)', value: 'body' },
  { title: 'Photos', value: 'images' },
  { title: 'Blocks', value: 'blocks' },
  { title: 'Details', value: 'details' },
  { title: 'Authors', value: 'authors' }
]

export const ALL_ENTRY_FIELDS = ENTRY_FIELDS.map(field => field.value)

// Entries created before sections existed have none set: show everything
export function usesField(document: unknown, field: string) {
  const sections = (document as { sections?: unknown } | undefined)?.sections
  return !Array.isArray(sections) || sections.includes(field)
}
