import { stegaClean } from '@sanity/client/stega'
import type { ButtonProps } from '@nuxt/ui'
import type { SanityLink } from '~/types/sanity'

// Values used as logic (icon names, colors, variants, URLs) must be cleaned of
// stega encoding, otherwise icons and Tailwind classes break during Visual Editing.
export function toButton(link: Partial<SanityLink> | null | undefined): ButtonProps | undefined {
  if (!link) return undefined

  return {
    label: link.label ?? undefined,
    to: stegaClean(link.to) ?? undefined,
    target: link.newTab ? '_blank' : undefined,
    icon: stegaClean(link.icon) ?? undefined,
    trailingIcon: stegaClean(link.trailingIcon) ?? undefined,
    color: stegaClean(link.color) ?? undefined,
    variant: stegaClean(link.variant) ?? undefined
  }
}

export function toButtons(links: Partial<SanityLink>[] | null | undefined): ButtonProps[] | undefined {
  return links?.map(toButton).filter((link): link is ButtonProps => !!link)
}
