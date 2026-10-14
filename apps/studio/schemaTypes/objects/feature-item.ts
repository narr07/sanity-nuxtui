import { defineField, defineType } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons/BulbOutline'
import { iconField } from '../shared/fields'

// Maps to PageFeatureProps (the `features` prop on UPageSection).
export const featureItem = defineType({
  name: 'featureItem',
  title: 'Feature',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    iconField()
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' }
  }
})
