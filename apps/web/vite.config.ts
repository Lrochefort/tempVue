import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vitest/config'

const isTest = process.env.VITEST === 'true'

export default defineConfig({
  plugins: [vue(), vueJsx(), ...(isTest ? [] : [vueDevTools()])],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2023',
    sourcemap: true,
  },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
