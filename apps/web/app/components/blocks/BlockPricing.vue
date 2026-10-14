<script setup lang="ts">
import { stegaClean } from '@sanity/client/stega'
import type { BlockOf } from '~/types/sanity'

defineProps<{
  block: BlockOf<'pricing'>
  index: number
}>()
</script>

<template>
  <UPageSection
    :id="stegaClean(block.anchor)"
    :headline="block.headline"
    :title="block.title"
    :description="block.description"
  >
    <UPricingPlans>
      <UPricingPlan
        v-for="plan in block.plans"
        :key="plan._key"
        :title="plan.title"
        :description="plan.description"
        :badge="plan.badge"
        :price="plan.price"
        :discount="plan.discount"
        :billing-cycle="plan.billingCycle"
        :billing-period="plan.billingPeriod"
        :features="plan.features ?? undefined"
        :button="toButton(plan.button)"
        :tagline="plan.tagline"
        :terms="plan.terms"
        :highlight="plan.highlight"
        :scale="plan.scale"
        :variant="stegaClean(plan.variant)"
      />
    </UPricingPlans>
  </UPageSection>
</template>
