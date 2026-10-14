import { defineField, type FieldDefinition } from 'sanity'

// Option values mirror Nuxt UI props one-to-one, so the frontend can pass them
// straight through without any mapping.

export const COLORS = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'] as const

export function iconField(name = 'icon', title = 'Icon') {
  return defineField({
    name,
    title,
    type: 'string',
    description: 'Iconify name, e.g. i-lucide-rocket or i-simple-icons-github. Browse at https://icones.js.org',
    validation: rule => rule.regex(/^i-[a-z0-9]+-[a-z0-9-]+$/, { name: 'icon' })
  })
}

export function orientationField(initialValue: 'vertical' | 'horizontal' = 'vertical') {
  return defineField({
    name: 'orientation',
    title: 'Orientation',
    type: 'string',
    description: 'Horizontal places the media next to the text',
    options: { list: ['vertical', 'horizontal'], layout: 'radio', direction: 'horizontal' },
    initialValue
  })
}

export const reverseField = defineField({
  name: 'reverse',
  title: 'Reverse (media first)',
  type: 'boolean',
  initialValue: false,
  hidden: ({ parent }) => parent?.orientation !== 'horizontal'
})

export const anchorField = defineField({
  name: 'anchor',
  title: 'Anchor ID',
  type: 'string',
  description: 'Lets you link to this section, e.g. "features" for /#features',
  validation: rule => rule.regex(/^[a-z0-9-]+$/, { name: 'lowercase-kebab-case' })
})

export const headerFields = [
  defineField({ name: 'headline', title: 'Headline', type: 'string', description: 'Small label above the title' }),
  defineField({ name: 'title', title: 'Title', type: 'string' }),
  defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 })
]

export function imageField(name = 'image', title = 'Image', extraFields: FieldDefinition[] = []) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        description: 'Describe the image for screen readers and search engines',
        validation: rule => rule.custom((alt, ctx) => {
          const parent = ctx.parent as { asset?: unknown } | undefined
          return parent?.asset && !alt ? 'Add alternative text for accessibility' : true
        }).warning()
      }),
      ...extraFields
    ]
  })
}

export const captionField = defineField({ name: 'caption', title: 'Caption', type: 'string' })

export const linksField = defineField({
  name: 'links',
  title: 'Buttons',
  type: 'array',
  of: [{ type: 'link' }],
  validation: rule => rule.max(4)
})
