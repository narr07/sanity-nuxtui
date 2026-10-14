<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue'
import { stegaClean } from '@sanity/client/stega'
import { SanityContent, UAlert, ULink } from '#components'
import AppImage from '~/components/AppImage.vue'
import type { SanityLink } from '~/types/sanity'

defineProps<{
  value: Array<{ _type: string, _key?: string }>
}>()

type PortableTextComponents = NonNullable<InstanceType<typeof SanityContent>['$props']['components']>

interface CalloutValue {
  title?: string
  description?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
  links?: Partial<SanityLink>[]
}

// Renders a tag with semantic Nuxt UI classes, so text follows the theme and dark mode
function tag<P>(name: string, className: string): FunctionalComponent<P> {
  return (_props, { slots }) => h(name, { class: className }, slots.default?.())
}

const components: PortableTextComponents = {
  block: {
    normal: tag('p', 'my-5 leading-7 text-default'),
    h2: tag('h2', 'mt-12 mb-6 scroll-mt-24 text-2xl font-bold text-highlighted'),
    h3: tag('h3', 'mt-10 mb-4 scroll-mt-24 text-xl font-bold text-highlighted'),
    h4: tag('h4', 'mt-8 mb-3 text-lg font-semibold text-highlighted'),
    blockquote: tag('blockquote', 'my-6 border-s-4 border-primary ps-4 text-muted italic')
  },
  list: {
    bullet: tag('ul', 'my-5 list-disc ps-6 marker:text-muted'),
    number: tag('ol', 'my-5 list-decimal ps-6 marker:text-muted')
  },
  listItem: tag('li', 'my-1.5 ps-1.5 leading-7'),
  marks: {
    'strong': tag('strong', 'font-semibold text-highlighted'),
    'em': tag('em', 'italic'),
    'underline': tag('span', 'underline underline-offset-4'),
    'strike-through': tag('s', 'line-through'),
    'code': tag('code', 'rounded-md bg-elevated px-1.5 py-0.5 font-mono text-sm'),
    'link': ({ value }, { slots }) => h(
      ULink,
      {
        to: stegaClean(value?.href),
        target: value?.newTab ? '_blank' : undefined,
        class: 'font-medium text-primary underline underline-offset-4 hover:no-underline'
      },
      () => slots.default?.()
    )
  },
  types: {
    image: ({ value }) => h('figure', { class: 'my-8' }, [
      h(AppImage, {
        image: value,
        width: 768,
        sizes: '(min-width: 768px) 768px, 100vw',
        class: 'h-auto w-full rounded-lg'
      }),
      value?.caption ? h('figcaption', { class: 'mt-2 text-center text-sm text-muted' }, value.caption) : null
    ]),
    callout: ({ value }: { value: CalloutValue }) => h(UAlert, {
      class: 'my-6',
      title: value.title,
      description: value.description,
      icon: stegaClean(value.icon) || 'i-lucide-info',
      color: stegaClean(value.color) ?? 'primary',
      variant: stegaClean(value.variant) ?? 'subtle',
      actions: toButtons(value.links)
    }),
    codeBlock: ({ value }: { value: { filename?: string, code?: string } }) => h('div', { class: 'my-6 overflow-hidden rounded-lg border border-default' }, [
      value.filename ? h('div', { class: 'border-b border-default bg-elevated px-4 py-2 font-mono text-xs text-muted' }, value.filename) : null,
      h('pre', { class: 'overflow-x-auto bg-muted p-4 text-sm leading-6' }, [h('code', { class: 'font-mono' }, value.code)])
    ])
  }
}
</script>

<template>
  <SanityContent
    :value="value"
    :components="components"
  />
</template>
