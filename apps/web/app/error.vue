<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  robots: 'noindex'
})
</script>

<template>
  <UApp>
    <UError
      :error="error"
      :clear="{ label: 'Back to home' }"
      redirect="/"
    />
  </UApp>
</template>
