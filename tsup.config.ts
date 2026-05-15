import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/main.ts'],
  splitting: false,
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  target: 'es2022',
  external: ['vite']
});
