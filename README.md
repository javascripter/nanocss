# NanoCSS

A lightweight, high-performance CSS-in-JS library with no build steps and minimal runtime.

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

export const { create, props, styleSheet } = nanocss({
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

### Performance Considerations

NanoCSS is designed with performance in mind:

- The `create` function does most of the heavy lifting outside of the render cycle.
- The `props` function is optimized for fast merging during rendering.
- CSS variables are used to create a small initial stylesheet, reducing the payload size.

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

Each argument must be a simple `number` or `string` value and cannot be used to derive other values (e.g., `(width: number) => ({ width: width + 'px'})` is not allowed).
This is because styles are statically generated and values are passed via CSS variables.

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

`nanocss.inline` must compute and resolve nested conditions during rendering so it should be used sparingly.

### Best Practices

1. Define styles outside of your components using `create` for better performance.
2. Leverage style composition for creating variant styles.
3. For dynamic styles, prefer conditional styles over style functions in `create`.
4. `inline` function should be used sparingly to hoist computation outside rendering.

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
  design for predictive and deterministic styling.
