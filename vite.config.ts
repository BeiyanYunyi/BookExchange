import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  root: './frontend',
  plugins: [vue()],
  server: { proxy: { '/api': 'http://127.0.0.1:3001' } },
});
