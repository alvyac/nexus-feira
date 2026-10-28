import { defineConfig } from 'vite';

export default defineConfig({
  base: '/nexus-feira/',
  build: {
    target: 'es2022',
    sourcemap: true,
    reportCompressedSize: true,
  },
  server: {
    strictPort: true,
  },
});
