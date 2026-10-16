import { defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons/Rocket'
import { headerFields, imageField, linksField, orientationField, reverseField } from '../shared/fields'

// UPageHero
export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: RocketIcon,
  description: 'Large intro section with title, description, buttons and an optional image',
  fields: [
    ...headerFields,
    linksField,
    imageField(),
    orientationField('horizontal'),
    reverseField
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Untitled', subtitle: 'Hero', media: media ?? RocketIcon })
  }
})
