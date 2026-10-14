import { defineArrayMember, defineField, defineType } from 'sanity'
import { CreditCardIcon } from '@sanity/icons/CreditCard'
import { anchorField, headerFields } from '../shared/fields'

// UPageSection > UPricingPlans > UPricingPlan
export const pricing = defineType({
  name: 'pricing',
  title: 'Pricing',
  type: 'object',
  icon: CreditCardIcon,
  description: 'Up to four pricing plans side by side',
  fields: [
    anchorField,
    ...headerFields,
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      validation: rule => rule.max(4),
      of: [defineArrayMember({
        name: 'plan',
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Plan name', type: 'string', validation: rule => rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
          defineField({ name: 'badge', title: 'Badge', type: 'string', description: 'e.g. "Most popular"' }),
          defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "$29" or "Free"' }),
          defineField({ name: 'discount', title: 'Discounted price', type: 'string', description: 'When set, the regular price is struck through' }),
          defineField({ name: 'billingCycle', title: 'Billing cycle', type: 'string', description: 'e.g. "/month"' }),
          defineField({ name: 'billingPeriod', title: 'Billing period', type: 'string', description: 'e.g. "billed annually"' }),
          defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] }),
          defineField({ name: 'button', title: 'Button', type: 'link' }),
          defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
          defineField({ name: 'terms', title: 'Terms', type: 'string', description: 'e.g. "14-day free trial"' }),
          defineField({ name: 'highlight', title: 'Highlight', type: 'boolean', initialValue: false }),
          defineField({ name: 'scale', title: 'Scale up', type: 'boolean', initialValue: false }),
          defineField({
            name: 'variant',
            title: 'Variant',
            type: 'string',
            options: { list: ['outline', 'solid', 'soft', 'subtle'] },
            initialValue: 'outline'
          })
        ],
        preview: {
          select: { title: 'title', price: 'price', cycle: 'billingCycle' },
          prepare: ({ title, price, cycle }) => ({ title, subtitle: [price, cycle].filter(Boolean).join(' ') })
        }
      })]
    })
  ],
  preview: {
    select: { title: 'title', plans: 'plans' },
    prepare: ({ title, plans }) => ({ title: title || 'Pricing', subtitle: `Pricing · ${plans?.length ?? 0} plans`, media: CreditCardIcon })
  }
})
