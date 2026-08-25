import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
  },
  build: {
    target: 'es2023',
    sourcemap: true,
  },
  test: {
    // Coverage thresholds for this app are declared in the ROOT vitest.config.ts
    // via glob-keyed `coverage.thresholds`: Vitest computes coverage across the
    // whole run, so per-project thresholds here would be ignored.
    name: 'vfm-lab',
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
