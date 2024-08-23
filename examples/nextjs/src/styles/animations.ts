import * as nanocss from '@/lib/nanocss'

export const fadeIn = nanocss.keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

export const animations = nanocss.defineVars({
  fadeIn,
})
