import { defineConfig } from 'tsup';

type Format = 'esm' | 'cjs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'] satisfies Format[],
  sourcemap: true,
  dts: true,
  clean: true,
  target: 'es2022',
  minify: false,
  external: ['axios'],
});
