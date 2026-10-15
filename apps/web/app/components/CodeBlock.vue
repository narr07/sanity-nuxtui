<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'

// A code block from Sanity (@sanity/code-input) rendered with ProsePre: file name
// with icon, copy button and syntax highlighting from /api/highlight.
const props = defineProps<{
  code?: string | null
  language?: string | null
  filename?: string | null
  highlightedLines?: number[] | null
  /** Tab label inside ProseCodeGroup when there is no file name */
  label?: string | null
  /** Set by ProseCodeGroup, which shows the file name in its tabs instead */
  hideHeader?: boolean
}>()

const code = computed(() => stegaClean(props.code) ?? '')
const language = computed(() => stegaClean(props.language) || 'text')

const { data } = await useFetch('/api/highlight', {
  method: 'POST',
  key: `highlight-${hashString(`${language.value}:${props.highlightedLines?.join(',')}:${code.value}`)}`,
  body: { code, language, highlightedLines: props.highlightedLines ?? [] }
})
</script>

<template>
  <ProsePre
    :code="code"
    :language="language"
    :filename="stegaClean(filename) ?? undefined"
    :hide-header="hideHeader"
    data-shiki
  >
    <!-- eslint-disable vue/no-v-html -- Shiki output from our own server route -->
    <code
      v-if="data?.html"
      v-html="data.html"
    />
    <!-- eslint-enable vue/no-v-html -->
    <code v-else>{{ code }}</code>
  </ProsePre>
</template>
