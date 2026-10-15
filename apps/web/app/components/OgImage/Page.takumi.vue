<script setup lang="ts">
// Generated social image (1200 × 630) for pages without their own image.
// Rendered by Takumi; colors mirror the site theme (app.config.ts / main.css):
// primary "swiss" and neutral "mauve". Fonts come from @nuxt/fonts (nuxt.config.ts).
const {
  title = 'Build pages from blocks',
  description = '',
  headline = '',
  siteName = 'Sanity × Nuxt UI'
} = defineProps<{
  title?: string
  description?: string
  headline?: string
  siteName?: string
}>()

const colors = {
  primary: '#fc2900', // swiss-500
  text: '#0c090c', // mauve-950
  muted: '#79697b', // mauve-500
  line: '#e7e4e7', // mauve-200
  background: '#ffffff'
}

// Long titles get a smaller size so they stay within three lines
const titleSize = title.length > 70 ? 60 : title.length > 40 ? 72 : 88
</script>

<template>
  <div
    class="flex h-full w-full flex-col"
    :style="{ backgroundColor: colors.background, fontFamily: 'Funnel Sans', position: 'relative' }"
  >
    <!-- Swiss grid: visible column lines -->
    <div
      v-for="column in [1, 2, 3]"
      :key="column"
      :style="{ position: 'absolute', top: '16px', bottom: 0, left: `${column * 25}%`, width: '1px', backgroundColor: colors.line }"
    />

    <div :style="{ display: 'flex', height: '16px', backgroundColor: colors.primary }" />

    <div
      class="flex flex-1 flex-col"
      :style="{ padding: '64px 80px 56px', position: 'relative' }"
    >
      <div
        v-if="headline"
        :style="{ display: 'flex', color: colors.primary, fontSize: '26px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }"
      >
        {{ headline }}
      </div>

      <div
        :style="{
          display: 'flex',
          marginTop: headline ? '20px' : '0',
          maxWidth: '1000px',
          color: colors.text,
          fontFamily: 'Funnel Display',
          fontSize: `${titleSize}px`,
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: '-0.03em'
        }"
      >
        {{ title }}
      </div>

      <div
        v-if="description"
        :style="{ display: 'flex', marginTop: '28px', maxWidth: '900px', color: colors.muted, fontSize: '30px', lineHeight: 1.4 }"
      >
        {{ description }}
      </div>

      <div :style="{ display: 'flex', alignItems: 'center', marginTop: 'auto' }">
        <div :style="{ width: '28px', height: '28px', backgroundColor: colors.primary }" />
        <div :style="{ display: 'flex', marginLeft: '16px', color: colors.text, fontFamily: 'Funnel Display', fontSize: '30px', fontWeight: 600 }">
          {{ siteName }}
        </div>
      </div>
    </div>
  </div>
</template>
