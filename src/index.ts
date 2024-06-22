import type * as React from 'react'
import { createHooks } from '@css-hooks/react'

type Falsy = undefined | null | false

type RecursiveArray<T> = Array<T | ReadonlyArray<T> | RecursiveArray<T>>

type PropertyValue<HookName, T> = HookName extends string
  ?
      | T
      | null
      | ({
          default: T | null
        } & { [K in HookName]?: PropertyValue<HookName, T> })
  : never

type CSSProperties<HookName> = {
  [K in keyof React.CSSProperties]?: HookName[] extends never[]
    ? React.CSSProperties[K] | undefined
    : PropertyValue<HookName, React.CSSProperties[K]> | undefined
}

type Style = {
  readonly $$css: unique symbol
}

type StyleProp = Style | RecursiveArray<Style | Falsy> | Falsy

type HookNames = `:${string}` | `@media ${string}` | `@supports ${string}`

type Hooks<T extends HookNames> = {
  [K in T]: K extends `:${string}` ? `&${K}` : K
}

// Make invalid CSS properties an error by disallowing excess properties.
type ValidateStyles<HookName, S> = IsValidStyles<HookName, S> extends true
  ? S
  : never

type IsValidStyles<HookName, S> = {
  [K in keyof S]: S[K] extends (...args: any[]) => infer R
    ? keyof R extends keyof React.CSSProperties
      ? {
          [P in keyof R]: IsValidPropertyValue<
            HookName,
            React.CSSProperties[P],
            R[P]
          >
        }[keyof R]
      : false
    : keyof S[K] extends keyof React.CSSProperties
    ? {
        [P in keyof S[K]]: IsValidPropertyValue<
          HookName,
          React.CSSProperties[P],
          S[K][P]
        >
      }[keyof S[K]]
    : false
}[keyof S]

type IsValidPropertyValue<HookName, T, V> = V extends T | null
  ? true
  : V extends object
  ? keyof V extends HookName | 'default'
    ? {
        [K in keyof V]: IsValidPropertyValue<HookName, T, V[K]>
      }[keyof V]
    : false
  : false

/**
 * Creates a nanocss instance with the provided hooks and debug options.
 * @param hooks - Array of hook names (e.g. `[':hover', '@media (min-width: 768px)']`).
 * @param debug - Optional debug flag.
 * @returns An object containing props, create, inline, and styleSheet functions.
 */
function nanocss<T extends HookNames>({
  hooks,
  debug,
}: {
  hooks: T[]
  debug?: boolean
}) {
  const { styleSheet, css } = createHooks({
    hooks: Object.fromEntries(
      hooks.map((hook) => [hook, hook.startsWith(':') ? `&${hook}` : hook])
    ) as Hooks<T>,
    debug,
  })

  /**
   * Merges styles and returns a style props object to spread into a component.
   * @param styles - Array of styles to merge.
   * @returns A style props object with a className and style property.
   */
  function props(...styles: StyleProp[]): {
    className?: string
    style?: React.CSSProperties
  } {
    const style: Record<string, any> = {}

    // Maintain the property order of the styles
    for (const flatStyle of (styles as any[]).flat(Infinity)) {
      if (!flatStyle) continue
      Object.keys(flatStyle).forEach((key) => {
        delete style[key]
        style[key] = flatStyle[key]
      })
    }

    return { style }
  }

  /**
   * Resolves hooks and returns a Style object.
   * @param style - CSS properties with potential hooks.
   * @returns A Style object to pass to the props function.
   */
  function inline(style: CSSProperties<T>): Style {
    const result: Record<string, any> = {}

    const on: Array<[string | { and: string[] }, Record<string, any>]> = []

    for (const prop in style) {
      const value = style[prop as keyof typeof style]

      if (value == null) {
        result[prop] = undefined
      } else if (typeof value === 'object') {
        const stack: Array<{
          conditions: string[]
          value: any
        }> = [
          {
            conditions: [],
            value,
          },
        ]

        // Resolve nested conditions
        while (stack.length > 0) {
          const current = stack.pop()!
          if (current.value !== null && typeof current.value === 'object') {
            for (const condition in current.value) {
              if (condition === 'default') {
                stack.push({
                  conditions: current.conditions,
                  value: current.value[condition],
                })
              } else {
                stack.push({
                  conditions: [...current.conditions, condition],
                  value: current.value[condition],
                })
              }
            }
          } else {
            if (current.conditions.length === 0) {
              // Resolve default value
              result[prop] = current.value
            } else {
              on.unshift([
                { and: current.conditions },
                { [prop]: current.value },
              ])
            }
          }
        }
      } else {
        result[prop] = value
      }
    }

    if (on.length > 0) {
      result['on'] = on
    }

    return css(result) as Style
  }

  let id = 0

  /**
   * Creates a set of styles.
   * @param styles - Object containing CSS properties or functions returning CSS properties with potential hooks.
   * @returns An object with the same keys as the input styles object, but the values are Style objects or functions returning Style objects.
   */
  function create<
    const S extends {
      [key: string]: CSSProperties<T> | ((...args: any[]) => CSSProperties<T>)
    }
  >(
    styles: ValidateStyles<T, S>
  ): {
    [K in keyof S]: S[K] extends (...args: infer Args) => CSSProperties<T>
      ? (...args: Args) => Style
      : Style
  } {
    const result: Record<string, any> = {}
    for (const key in styles) {
      const style = styles[key]
      if (typeof style === 'function') {
        const vars = Array.from({ length: style.length }).map(
          () => `--_nanocss_var_${id++}`
        )
        const inlineStyle = inline(style(...vars.map((v) => `var(${v})`)))
        result[key] = (...args: any[]) => ({
          ...inlineStyle,
          ...Object.fromEntries(vars.map((v, i) => [v, args[i]])),
        })
      } else {
        result[key] = inline(style)
      }
    }
    return result as any
  }

  return {
    props,
    create,
    inline,
    styleSheet,
  }
}

export { nanocss }
