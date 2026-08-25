import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Each workspace package contributes its own Vitest project via its
    // `vite.config.ts` (see `test.name` in each of them).
    projects: ['apps/*', 'packages/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['apps/*/src/**/*.{ts,vue}', 'packages/*/src/**/*.{ts,vue}'],
      exclude: ['**/*.d.ts', '**/*.{test,spec}.ts', '**/__tests__/**', '**/main.ts', '**/index.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
        // vfm-lab exists to certify vue-final-modal, so it is held to a higher
        // bar than the repo default. Vitest resolves glob keys relative to the
        // repo root; a glob that matches nothing passes silently, so verify it
        // still bites after moving files around.
        'apps/vfm-lab/src/**/*.{ts,vue}': {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
})
