import { defineArrayMember, defineField, defineType } from 'sanity'
import { codeOptions } from '../shared/code'
import { captionField, imageField } from '../shared/fields'

// Rich text used by posts and the "Rich Text" block.
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' }
        ],
        annotations: [
          defineField({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({ name: 'href', title: 'URL', type: 'string', validation: rule => rule.required() }),
              defineField({ name: 'newTab', title: 'Open in new tab', type: 'boolean' })
            ]
          })
        ]
      }
    }),
    defineArrayMember({ ...imageField('image', 'Image', [captionField]), name: 'image' }),
    // Same type as the page-builder Callout block
    defineArrayMember({ type: 'callout' }),
    // Syntax-highlighted code with a file name and a copy button on the site
    defineArrayMember({ type: 'code', title: 'Code', options: codeOptions }),
    // Several code blocks as tabs
    defineArrayMember({ type: 'codeGroup' })
  ]
})
