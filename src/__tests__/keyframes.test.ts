import { it, expect } from 'vitest'
import { createKeyframes } from '../keyframes'

it('should generate keyframes', () => {
  const { keyframes, styleSheet } = createKeyframes({
    debug: true,
  })

  const pulse = keyframes({
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  })

  const fadeIn = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  })

  expect(pulse).toMatchInlineSnapshot(`"__nanocss_keyframes-0"`)
  expect(fadeIn).toMatchInlineSnapshot(`"__nanocss_keyframes-1"`)

  expect(styleSheet([pulse, fadeIn])).toMatchInlineSnapshot(`
    "@keyframes __nanocss_keyframes-0 {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes __nanocss_keyframes-1 {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }"
  `)
})

it('should support numeric unit values', () => {
  const { keyframes, styleSheet } = createKeyframes({
    debug: true,
  })

  const animationName = keyframes({
    '0%': { top: 0 },
    '50%': { top: 100 },
  })

  expect(animationName).toMatchInlineSnapshot(`"__nanocss_keyframes-0"`)

  expect(styleSheet([animationName])).toMatchInlineSnapshot(`
    "@keyframes __nanocss_keyframes-0 {
      0% {
        top: 0px;
      }
      50% {
        top: 100px;
      }
    }"
  `)
})
