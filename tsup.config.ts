import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/main.ts'],
  splitting: false,
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true
})
