import { it, expect } from 'vitest'
import { nanocss } from '../index'

it('should generate an empty style sheet and props when no hooks are provided', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
    }
    "
  `)

  const styles = create({
    root: {
      color: 'black',
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "black",
      },
    }
  `)
})

it('should generate style sheet and props with :hover hook', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `
  )

  const styles = create({
    root: {
      color: {
        default: 'black',
        ':hover': 'red',
      },
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "var(--_hover-mbscpo-1, red) var(--_hover-mbscpo-0, black)",
      },
    }
  `)
})

it('should generate style sheet and props with :hover and :focus hooks at the same level', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover', ':focus'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
      --_focus-lddb28-0: initial;
      --_focus-lddb28-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    *:focus {
      --_focus-lddb28-0: ;
      --_focus-lddb28-1: initial;
    }
    "
  `
  )

  const styles = create({
    root: {
      color: {
        default: 'black',
        ':hover': 'red',
        ':focus': 'blue',
      },
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "var(--_focus-lddb28-1, blue) var(--_focus-lddb28-0, var(--_hover-mbscpo-1, red) var(--_hover-mbscpo-0, black))",
      },
    }
  `)
})

it('should generate style sheet and props with :hover and :focus hooks at different levels', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover', ':focus'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
      --_focus-lddb28-0: initial;
      --_focus-lddb28-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    *:focus {
      --_focus-lddb28-0: ;
      --_focus-lddb28-1: initial;
    }
    "
  `
  )

  const styles = create({
    root: {
      color: {
        default: 'black',
        ':hover': {
          default: 'red',
          ':focus': 'blue',
        },
      },
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "--cond-ynxk87-0": "var(--_hover-mbscpo-0) var(--_focus-lddb28-0)",
        "--cond-ynxk87-1": "var(--_hover-mbscpo-1, var(--_focus-lddb28-1))",
        "color": "var(--cond-ynxk87-1, blue) var(--cond-ynxk87-0, var(--_hover-mbscpo-1, red) var(--_hover-mbscpo-0, black))",
      },
    }
  `)
})

it('should override previous styles with hooks with the last style', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `
  )
  const styles = create({
    a: {
      color: {
        default: 'black',
        ':hover': 'red',
      },
    },
    b: {
      color: 'blue',
    },
  })

  expect(props(styles.a, styles.b)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "blue",
      },
    }
  `)
})

it('should reset previous styles with hooks to null', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `
  )

  const styles = create({
    a: {
      color: {
        default: 'black',
        ':hover': 'red',
      },
    },
    b: {
      color: null,
    },
  })

  expect(props(styles.a, styles.b)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": undefined,
      },
    }
  `)
})

it('should preserve the property order of styles', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `
  )

  const styles = create({
    a: {
      margin: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    b: {
      margin: 0,
      marginRight: 0,
      marginLeft: 0,
    },
    c: {
      marginLeft: 0,
      marginRight: 0,
      margin: 0,
    },
    d: {
      marginLeft: {
        default: 0,
        ':hover': 10,
      },
    },
    e: {
      marginRight: 0,
    },
  })
  function serialize(style: any) {
    return {
      className: style.className,
      // Explicitly convert the style object to an array to preserve the order
      style: Object.entries(style.style ?? {}),
    }
  }

  expect(serialize(props(styles.a))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "margin",
          0,
        ],
        [
          "marginLeft",
          0,
        ],
        [
          "marginRight",
          0,
        ],
      ],
    }
  `)

  expect(serialize(props(styles.b))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "margin",
          0,
        ],
        [
          "marginRight",
          0,
        ],
        [
          "marginLeft",
          0,
        ],
      ],
    }
  `)

  expect(serialize(props(styles.c))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "marginLeft",
          0,
        ],
        [
          "marginRight",
          0,
        ],
        [
          "margin",
          0,
        ],
      ],
    }
  `)

  expect(serialize(props(styles.a, styles.b))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "margin",
          0,
        ],
        [
          "marginRight",
          0,
        ],
        [
          "marginLeft",
          0,
        ],
      ],
    }
  `)

  expect(serialize(props(styles.a, styles.b, styles.c))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "marginLeft",
          0,
        ],
        [
          "marginRight",
          0,
        ],
        [
          "margin",
          0,
        ],
      ],
    }
  `)

  expect(serialize(props(styles.a, styles.d))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "margin",
          0,
        ],
        [
          "marginRight",
          0,
        ],
        [
          "marginLeft",
          "var(--_hover-mbscpo-1, 10px) var(--_hover-mbscpo-0, 0px)",
        ],
      ],
    }
  `)

  expect(serialize(props(styles.d, styles.e))).toMatchInlineSnapshot(`
    {
      "className": undefined,
      "style": [
        [
          "marginLeft",
          "var(--_hover-mbscpo-1, 10px) var(--_hover-mbscpo-0, 0px)",
        ],
        [
          "marginRight",
          0,
        ],
      ],
    }
  `)
})

it('should support dynamic functions with string values', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `
  )

  const styles = create({
    root: (color: string) => ({
      color,
    }),
  })

  expect(props(styles.root('red'))).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "red",
      },
    }
  `)
})

it('should support dynamic functions with numeric unit values', () => {
  const { styleSheet, create, props } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(
    `
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `
  )

  const styles = create({
    root: (width: number) => ({
      width,
    }),
  })

  expect(props(styles.root(100))).toMatchInlineSnapshot(`
    {
      "style": {
        "width": 100,
      },
    }
  `)
})

it('should generate style sheet and props with custom properties', () => {
  const { styleSheet, create, props, defineVars } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `)

  const colors = defineVars({
    primary: 'green',
  })

  const styles = create({
    root: {
      color: colors.primary,
      backgroundColor: {
        default: 'red',
        ':hover': 'blue',
      },
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "backgroundColor": "var(--_hover-mbscpo-1, blue) var(--_hover-mbscpo-0, red)",
        "color": "var(--_nanocss_var_0, green)",
      },
    }
  `)
})

it('should generate style sheet and props with custom properties and can override with var name as property key', () => {
  const { styleSheet, create, props, defineVars } = nanocss({
    hooks: [],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
    }
    "
  `)

  const colors = defineVars({
    primary: 'green',
  })

  // @ts-expect-error This is an advanced use case and is not typed correctly at
  // the moment. React.CSSProperties does not allow arbitrary string as a key.
  const styles = create({
    root: {
      color: colors.primary,
      [colors.primary]: 'red',
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "--_nanocss_var_0": "red",
        "color": "var(--_nanocss_var_0, green)",
      },
    }
  `)
})

it('should generate style sheet and props with custom properties with nested objects', () => {
  const { styleSheet, create, props, defineVars } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `)

  const colors = defineVars({
    primary: 'green',
  })

  const styles = create({
    root: {
      color: {
        default: colors.primary,
        ':hover': 'red',
      },
    },
  })

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "var(--_hover-mbscpo-1, red) var(--_hover-mbscpo-0, var(--_nanocss_var_0, green))",
      },
    }
  `)
})

it('should generate style sheet and props with custom properties and themes', () => {
  const { styleSheet, create, props, defineVars, createTheme } = nanocss({
    hooks: [],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
    }
    "
  `)

  const colors = defineVars({
    primary: 'green',
  })

  const theme = createTheme(colors, {
    primary: 'red',
  })

  const styles = create({
    root: {
      color: colors.primary,
    },
  })

  expect(props(theme, styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "--_nanocss_var_0": "red",
        "color": "var(--_nanocss_var_0, green)",
      },
    }
  `)
})

it('should generate style sheet and props with custom properties and themes with nested objects', () => {
  const { styleSheet, create, props, defineVars, createTheme } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
      --_hover-mbscpo-0: initial;
      --_hover-mbscpo-1: ;
    }
    *:hover {
      --_hover-mbscpo-0: ;
      --_hover-mbscpo-1: initial;
    }
    "
  `)

  const colors = defineVars({
    primary: 'green',
  })

  const theme = createTheme(colors, {
    primary: {
      default: 'red',
      ':hover': 'blue',
    },
  })

  const styles = create({
    root: {
      color: colors.primary,
    },
  })

  expect(props(theme, styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "--_nanocss_var_0": "var(--_hover-mbscpo-1, blue) var(--_hover-mbscpo-0, red)",
        "color": "var(--_nanocss_var_0, green)",
      },
    }
  `)
})

it('should generate style sheet and props with custom properties and themes with overrides', () => {
  const { styleSheet, create, props, defineVars, createTheme } = nanocss({
    hooks: [],
    debug: true,
  })

  expect(styleSheet()).toMatchInlineSnapshot(`
    "* {
    }
    "
  `)

  const colors = defineVars({
    primary: 'green',
  })

  const theme = createTheme(colors, {
    primary: 'red',
  })

  const themeOverride = createTheme(colors, {
    primary: 'blue',
  })

  const styles = create({
    root: {
      color: colors.primary,
    },
  })

  expect(props(theme, themeOverride, styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "--_nanocss_var_0": "blue",
        "color": "var(--_nanocss_var_0, green)",
      },
    }
  `)

  const stylesOverride = create({
    root: {
      color: colors.primary,
    },
  })

  expect(props(stylesOverride.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "color": "var(--_nanocss_var_0, green)",
      },
    }
  `)
})

it('should throw an error when trying to use a hook that is not defined', () => {
  const { create } = nanocss({
    hooks: [':hover'],
    debug: true,
  })

  expect(() => {
    // @ts-expect-error This is a type error but can still happen in runtime if
    // using NanoCSS in JavaScript or when using it as a replacement for StyleX.
    create({
      root: {
        color: {
          default: 'black',
          ':focus': 'red',
        },
      },
    })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: [nanocss] ":focus" was used but not declared in the hooks array. Please add it to the hooks array.]`
  )
})

it('should support keyframes', () => {
  const { create, props, defineVars, keyframes, styleSheet } = nanocss({
    hooks: [],
    debug: true,
  })

  const fadeIn = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  })
  const animations = defineVars({
    fadeIn,
  })

  const styles = create({
    root: {
      animationName: animations.fadeIn,
    },
  })

  expect(
    styleSheet({
      keyframes: [fadeIn],
    })
  ).toMatchInlineSnapshot(`
    "* {
    }

    @keyframes __nanocss_keyframes-0 {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }"
  `)

  expect(props(styles.root)).toMatchInlineSnapshot(`
    {
      "style": {
        "animationName": "var(--_nanocss_var_0, __nanocss_keyframes-0)",
      },
    }
  `)
})
