/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './frontend',
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      eslintrc: { enabled: true },
    }),
    Components({ resolvers: [NaiveUiResolver()] }),
    legacy({ targets: ['defaults', 'not IE 11'], modernPolyfills: true }),
  ],
  server: { proxy: { '/api': 'http://127.0.0.1:3001' } },
  build: { outDir: '../backend/static', emptyOutDir: true },
  test: { root: '.', coverage: { enabled: true, provider: 'v8' } },
});
