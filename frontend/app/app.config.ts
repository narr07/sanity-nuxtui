// Swiss-style theme on top of Nuxt UI. Layout rules: left-aligned type, an
// asymmetric 12-column grid (labels on the left, content on the right),
// hairline rules between sections, square corners and one red accent.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'swiss',
      secondary: 'zinc',
      warning: 'amber',
      error: 'rose',
      neutral: 'mauve'
    },

    button: {
      slots: {
        base: 'transition-[color,background-color,border-color,transform] duration-200 active:translate-y-px'
      }
    },

    header: {
      slots: {
        root: 'bg-default/85 backdrop-blur-md',
        title: 'font-heading text-lg tracking-tight'
      }
    },

    pageHero: {
      slots: {
        container: 'py-20 sm:py-28 lg:py-36 gap-12 sm:gap-y-20',
        headline: 'mb-8',
        title: 'font-heading font-semibold tracking-[-0.045em] leading-[0.92] text-balance',
        description: 'text-lg sm:text-xl/8 text-muted max-w-2xl',
        links: 'gap-x-3 gap-y-3'
      },
      variants: {
        orientation: {
          vertical: {
            wrapper: 'text-left',
            headline: 'justify-start',
            title: 'text-6xl sm:text-8xl lg:text-9xl',
            description: 'text-pretty',
            links: 'justify-start'
          },
          horizontal: {
            container: 'lg:gap-x-16',
            title: 'text-5xl sm:text-7xl'
          }
        }
      }
    },

    pageSection: {
      slots: {
        container: 'py-20 sm:py-28 lg:py-36 gap-12 sm:gap-16 border-t border-default',
        headline: 'mb-6',
        title: 'font-heading font-semibold tracking-[-0.035em] leading-[1.02] text-4xl sm:text-5xl lg:text-6xl',
        description: 'text-base sm:text-lg text-muted text-pretty'
      },
      variants: {
        orientation: {
          vertical: {
            header: 'lg:grid lg:grid-cols-12 lg:gap-x-8',
            headline: 'justify-start lg:col-span-3 lg:row-span-2 lg:mb-0 lg:pt-3',
            leading: 'justify-start',
            title: 'text-left lg:col-span-9',
            description: 'text-left lg:col-span-7 lg:col-start-4 mt-6',
            links: 'justify-start',
            features: 'sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14'
          }
        }
      }
    },

    pageFeature: {
      slots: {
        root: 'border-t border-default pt-6',
        leading: 'mb-6',
        title: 'font-heading text-lg tracking-tight',
        description: 'text-[15px] leading-relaxed'
      }
    },

    pageCard: {
      slots: {
        root: 'transition-colors duration-300',
        title: 'font-heading text-lg tracking-tight',
        description: 'leading-relaxed'
      }
    },

    pageCTA: {
      slots: {
        root: 'rounded-none',
        container: 'px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-32',
        title: 'font-heading font-semibold tracking-[-0.04em] leading-[0.98] text-4xl sm:text-6xl lg:text-7xl',
        description: 'max-w-2xl'
      },
      variants: {
        orientation: {
          vertical: {
            title: 'text-left',
            description: 'text-left text-pretty',
            links: 'justify-start'
          }
        }
      }
    },

    accordion: {
      slots: {
        item: 'border-b border-default last:border-b',
        trigger: 'py-6 text-lg font-heading tracking-tight',
        body: 'pb-6'
      }
    },

    blogPost: {
      slots: {
        title: 'font-heading tracking-tight',
        image: 'transition-transform duration-700 ease-out'
      }
    },

    pricingPlan: {
      slots: {
        title: 'font-heading tracking-tight',
        price: 'font-heading tracking-[-0.03em]'
      }
    },

    pageHeader: {
      slots: {
        root: 'py-12 sm:py-16',
        title: 'font-heading font-semibold tracking-[-0.04em] leading-[0.95] text-5xl sm:text-7xl',
        description: 'max-w-2xl'
      }
    }
  }
})
