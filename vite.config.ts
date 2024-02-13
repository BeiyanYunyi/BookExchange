/// <reference types="vitest" />

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './frontend',
  plugins: [vue()],
  server: { proxy: { '/api': 'http://127.0.0.1:3001' }, host: '127.0.0.1' },
  build: { outDir: '../backend/static', emptyOutDir: true },
  test: { root: '.', coverage: { enabled: true, provider: 'v8' } },
});
