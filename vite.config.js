import { defineConfig } from 'vite';

// base relativa: o build funciona em qualquer subpasta (ex.: site.com/estudo/)
export default defineConfig({
  base: './',
  server: { host: true },
});
