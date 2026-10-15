<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue'
import { stegaClean } from '@sanity/client/stega'
import { ProseCodeGroup, SanityContent, UAlert, ULink } from '#components'
import AppImage from '~/components/AppImage.vue'
import CodeBlock from '~/components/CodeBlock.vue'
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

interface CodeValue {
  _key?: string
  code?: string
  language?: string
  filename?: string
  highlightedLines?: number[]
}

function codeProps(value: CodeValue) {
  return {
    code: value.code,
    language: value.language,
    filename: value.filename || undefined,
    // Tab label in ProseCodeGroup when there is no file name
    label: value.language,
    highlightedLines: value.highlightedLines
  }
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
        sizes: '100vw md:768px',
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
    // @sanity/code-input → ProsePre with file icon, copy button and highlighting
    code: ({ value }: { value: CodeValue }) => h(CodeBlock, codeProps(value)),
    // Several code blocks → ProseCodeGroup tabs, labelled by file name
    codeGroup: ({ value }: { value: { tabs?: CodeValue[] } }) => h(
      ProseCodeGroup,
      null,
      () => (value.tabs ?? []).map(tab => h(CodeBlock, { key: tab._key, ...codeProps(tab) }))
    )
  }
}
</script>

<template>
  <SanityContent
    :value="value"
    :components="components"
  />
</template>
