import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import { anchorField, headerFields } from '../shared/fields'

// Image grid with a UModal + UCarousel lightbox, or a UCarousel slider.
export const imageGallery = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  icon: ImageIcon,
  description: 'A set of images shown as a grid with lightbox, or as a slider',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [{ title: 'Grid with lightbox', value: 'grid' }, { title: 'Slider', value: 'carousel' }], layout: 'radio', direction: 'horizontal' },
      initialValue: 'grid'
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      options: { layout: 'grid' },
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption', type: 'string' })
        ]
      })],
      validation: rule => rule.min(1)
    })
  ],
  preview: {
    select: { title: 'title', images: 'images', media: 'images.0' },
    prepare: ({ title, images, media }) => ({ title: title || 'Image Gallery', subtitle: `Image Gallery · ${images?.length ?? 0} images`, media: media ?? ImageIcon })
  }
})
