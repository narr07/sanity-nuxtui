import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons/User'
import { iconField, imageField } from '../shared/fields'

// Post authors. Rendered with UUser / the `authors` prop of UBlogPost.
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g. "Editor" or "Frontend Engineer"' }),
    imageField('avatar', 'Avatar'),
    defineField({ name: 'bio', title: 'Short bio', type: 'text', rows: 3 }),
    defineField({
      name: 'links',
      title: 'Profiles',
      type: 'array',
      of: [defineArrayMember({
        name: 'profile',
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'url', title: 'URL', type: 'url', validation: rule => rule.required() }),
          iconField()
        ],
        preview: { select: { title: 'label', subtitle: 'url' } }
      })]
    })
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' }
  }
})
