<script setup lang="ts">
// Section label in the Swiss style: an index number, a short rule and the
// headline. Numbers follow the block position on the page, starting at 01.
const props = defineProps<{
  text: string
  index?: number
}>()

const number = computed(() => props.index === undefined ? undefined : String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <span class="inline-flex items-center gap-3 text-sm font-medium text-muted">
    <span
      v-if="number"
      class="text-primary tabular-nums"
    >{{ number }}</span>
    <span
      v-else
      class="size-2 bg-primary"
      aria-hidden="true"
    />
    <span
      class="h-px w-6 bg-(--ui-border-accented)"
      aria-hidden="true"
    />
    <span>{{ text }}</span>
  </span>
</template>
