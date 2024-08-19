# NanoCSS

A lightweight, high-performance CSS-in-JS library that outputs native inline styles with no build steps and minimal runtime.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/nextjs-nanocss-playground?embed=1&file=src%2Fapp%2Fpage.tsx)

## Features

- 🚀 Runtime-generated native inline styles with no build step required
- 🎨 Intuitive and predictable style composition with StyleX-inspired API
- 🖥️ Server-side rendering (SSR) support out of the box
- 🔧 Compatible with modern build tools like Turbopack
- 🏎️ Optimized for performance in RSC, SSR and CSR environments
- 📦 Tiny runtime footprint
- 🧠 Predictable style overriding with "last style wins" approach

## Installation

```bash
npm install @nanocss/nanocss
```

## Quick Start

```typescript
import * as nanocss from '@/lib/nanocss'

const styles = nanocss.create({
  root: {
    padding: 16,
  },
  element: {
    backgroundColor: {
      default: 'red',
      ':hover': 'blue',
    },
  },
})

export default function App() {
  return (
    <div {...nanocss.props(styles.root, styles.element)}>Hello, World!</div>
  )
}
```

## Usage

### 1. Set up NanoCSS

Create `src/lib/nanocss.ts` with the following contents:

```typescript
import { nanocss } from 'nanocss'

export const { props, create, inline, defineVars, createTheme, styleSheet } =
  nanocss({
    // Hooks defined here can be used inside `create` function.
    hooks: [':hover', '@media (max-width: 800px)'],
    debug: process.env.NODE_ENV !== 'production',
  })
```

Optional: You can use `nanocss` CLI to scan source code to generate hooks.

```bash
nanocss -i "./src/**/*.{ts,tsx}" -o "./src/lib/nanocss.ts"
```

`--watch` option can be used to dynamically generate hooks as well.

### 2. Add stylesheet

Modify `src/app/layout.tsx` and add the stylesheet:

```typescript
export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Define styles

Create `src/app/page.tsx` with the following contents:

```typescript
import * as nanocss from '@/lib/nanocss'

export default function App() {
  return (
    <main {...nanocss.props(styles.root)}>
      <h1>Title</h1>
      <div {...nanocss.props(styles.container)}>Hello, World!</div>
    </main>
  )
}

const styles = nanocss.create({
  root: {
    padding: 16,
  },
  container: {
    color: 'blue',
  },
})
```

## Core Concepts

### Flattened Conditional Styles

NanoCSS uses an object syntax to represent pseudo-states and media queries per property:

```typescript
const styles = nanocss.create({
  text: {
    color: {
      default: 'black',
      ':hover': 'blue',
      ':focus': 'green',
    },
  },
})
```

This flattened structure allows for predictable style merging and overriding.

### Style Composition

Compose styles easily using the props function:

```typescript
<div
  {...nanocss.props(
    styles.base,
    styles.variant,
    condition && styles.conditionalStyle
  )}
/>
```

Styles are merged in order, with later styles always taking precedence.
When merging multiple styles with the same property, the last value overrides all previous values including conditions.
This is modeled after `Object.assign` behavior.

### Runtime Generation

All styles are generated at runtime, eliminating the need for complex build processes and allowing for flexibility.

### Server-Side Rendering

NanoCSS works out of the box with SSR and RSC setups. The generated styles are included inline with your HTML, improving First Contentful Paint times.

### Dynamic Styles

Create dynamic styles using the function syntax in `create`:

```typescript
const styles = nanocss.create({
  color: (color: string) => ({
    color,
  }),
})
```

For highly dynamic styles, `nanocss.inline` can be used:

```typescript
function Component() {
  return (
    <div
      {...nanocss.props(
        nanocss.inline({
          color: {
            default: 'red',
            ':hover': 'blue',
          },
        })
      )}
    >
      Hello, World!
    </div>
  )
}
```

`nanocss.inline` must compute and resolve nested conditions during rendering so
it should be used sparingly.

### Themes

NanoCSS supports `defineVars` and `createTheme` APIs to define CSS variables
declaratively and override CSS variables for specific UI sub-trees.
The APIs are compatible with StyleX and supports nested conditions for both in
`defineVars` and `createTheme`.

To understand how these APIs work together, you can refer to [StyleX Themes
Docs](https://stylexjs.com/docs/learn/theming/defining-variables/).

**Defining CSS Variables**

```typescript
export const colors = nanocss.defineVars({
  primary: 'green',
})
```

Unlike StyleX, variables do not need to be defined in separate `.stylex.ts` files and can
be co-located with files defining styles and components. The same restriction
about `create` API still apply, and variables must be defined in the top scope
of the files rather than inside of render functions.

**Using variables**

```typescript
const styles = nanocss.create({
  container: {
    color: colors.primary,
  },
})
```

Each CSS variable defined is converted to a unique variable name, and can be
used inside `create` functions.

**Create themes**

```typescript
const theme = nanocss.createTheme(colors, {
  primary: 'red',
})
```

Themes allow you to override CSS variables defined with `defineVars`. All
variables must be overridden.

**Using themes**

```typescript
function Component() {
  return (
    <main {...nanocss.props(theme)}>
      <p {...nanocss.props(styles.container)}>Text</p>
    </main>
  )
}
```

Themes can be applied via `props` and overrides CSS variables of the same
element and its descendant UI sub-trees.

### Performance Considerations

NanoCSS is designed with performance in mind:

- The `create` function does most of the heavy lifting outside of the render cycle.
- The `props` function is optimized for fast merging during rendering.
- CSS variables are used to create a small initial stylesheet, reducing the payload size.

### Best Practices

1. Define styles outside of your components using `create` for better performance.
2. Leverage style composition for creating variant styles.
3. For dynamic styles, prefer conditional styles over style functions in `create`.
4. `inline` function should be used sparingly to hoist computation outside
   rendering.

## How does it work?

NanoCSS is built on top of [CSS Hooks](https://css-hooks.com/), which leverages
the fallback trick of CSS custom properties to enable pseudo-classes and media
queries in inline styles.

<details>
  <summary>
    Implementation Details
  </summary>
Given the following style definitions:

```typescript
const { create, styleSheet } = nanocss({
  hooks: [':hover'],
})

const styles = nanocss.create({
  root: {
    color: {
      default: 'black',
      ':hover': 'red',
    },
  },
})
```

NanoCSS generates the following `styleSheet` and `styles`:

```typescript
const styleSheet = () => `
* {
  --_hover-0: initial;
  --_hover-1: ;
}
*:hover {
  --_hover-0: ;
  --_hover-1: initial;
}
`

const styles = {
  root: {
    style: {
      color: 'var(--_hover-1, red) var(--_hover-0, black)',
    },
  },
}
```

The `styleSheet` function generates a small stylesheet with CSS custom properties for each defined hook (e.g., :hover).
The `create` function transforms style definitions into flat inline style objects that utilizes the generated CSS custom properties.

Then, the `props` function merges multiple nested styles into a single flat style object by iterating over the provided styles and flattening them in the specified order. When encountering conflicting properties, the last style takes precedence, ensuring a predictable "last style wins" approach.

```typescript
function props(...styles: StyleProp[]): {
  className?: string
  style?: React.CSSProperties
} {
  const style: Record<string, any> = {}

  for (const flatStyle of (styles as any[]).flat(Infinity)) {
    if (!flatStyle) continue
    Object.keys(flatStyle).forEach((key) => {
      delete style[key]
      style[key] = flatStyle[key]
    })
  }

  return { style }
}
```

The combination of CSS Hooks and a StyleX-inspired API allows NanoCSS to provide a simple and intuitive way to define and compose styles while ensuring predictable behavior and optimal performance across various rendering scenarios.

</details>

## Why NanoCSS?

NanoCSS offers a unique combination of performance, simplicity, and flexibility:

- No build step required, making it easy to integrate into any project
- Predictable style composition with a "last style wins" approach
- Optimized for various rendering scenarios (RSC, SSR, CSR)
- Tiny runtime footprint, minimizing impact on your bundle size
- Intuitive API inspired by StyleX, familiar to many developers

## TypeScript Support

NanoCSS is written in TypeScript and provides full type definitions out of the box. This ensures type safety when defining and using styles, catching potential errors at compile-time.

## Acknowledgements

- [CSS Hooks](https://github.com/css-hooks/css-hooks) for bringing advanced
  CSS capabilities including pseudo classes and media queries to native inline
  styles.
- [StyleX](https://github.com/facebook/stylex) for the simple and powerful API
  design for predictable and deterministic styling.
