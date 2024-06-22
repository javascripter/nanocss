import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!src/**/*.test.{ts,tsx}'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
})
