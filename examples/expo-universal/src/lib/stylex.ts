import { nanocss } from '@nanocss/nanocss'

const { styleSheet, ...css } = nanocss({
  hooks: [
    ':hover',
    // Add your hooks here
  ],
  debug: process.env.NODE_ENV !== 'production',
})

// For ESM imports
export const { create, props, defineVars, createTheme } = css

export { styleSheet } // Add styleSheet() in your layout.ts

export default css
