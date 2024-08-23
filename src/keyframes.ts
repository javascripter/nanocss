import { _stringifyValue } from '@css-hooks/react'

type Keyframes = {
  [key: string]: React.CSSProperties
}

export function createKeyframes(options?: { debug?: boolean }) {
  const { debug = false } = options ?? {}
  const [space, newline] = debug ? [' ', '\n'] : ['', '']

  const indent = `${space}${space}`

  let _id = 0

  const keyframeStyleSheets: Record<string, string> = {}

  function keyframes(frames: Keyframes) {
    const name = `__nanocss_keyframes-${_id++}`

    let styleSheet = []
    styleSheet.push(`@keyframes ${name}${space}{`)

    for (const key in frames) {
      styleSheet.push(`${indent}${key}${space}{`)
      const frame = frames[key]
      for (const prop in frame) {
        const value = frame[prop as keyof typeof frame]
        styleSheet.push(
          `${indent}${indent}${prop}:${space}${_stringifyValue(prop, value)};`
        )
      }
      styleSheet.push(`${indent}}`)
    }
    styleSheet.push(`}`)

    keyframeStyleSheets[name] = styleSheet.join(newline)

    return name
  }

  function styleSheet(keyframes: string[]) {
    return keyframes.map((name) => keyframeStyleSheets[name]).join(newline)
  }

  return { keyframes, styleSheet }
}
