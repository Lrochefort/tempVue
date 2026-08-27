import process from 'node:process'

import { defineConfig, devices } from '@playwright/test'

/**
 * The suite runs against the production build (`vite preview`), not the dev
 * server, so transition timing is not skewed by HMR or on-demand transforms.
 * Port 4174 keeps it clear of the dev server's 5174.
 */
const PORT = 4174
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    // Transitions are part of what this suite certifies: never disable
    // animations or force reduced motion globally.
  },
  projects: [
    {
      name: 'chromium',
      // scroll.e2e.ts needs classic scrollbars — see the chromium-headed project.
      testIgnore: '**/scroll.e2e.ts',
      use: {
        ...devices['Desktop Chrome'],
        // The full chromium build (not the headless shell) matches real user
        // rendering more closely.
        channel: 'chromium',
      },
    },
    {
      // Headless chromium only paints overlay scrollbars, which occupy no
      // layout width; reserveScrollBarGap then has nothing to measure or
      // compensate. The scroll group therefore runs headed (CI wraps it in
      // xvfb), where classic scrollbars exist.
      name: 'chromium-headed',
      testMatch: '**/scroll.e2e.ts',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        headless: false,
      },
    },
    {
      // Touch-driven gestures need a touch-capable viewport; everything else
      // is already covered by the desktop project.
      name: 'mobile-chromium',
      testMatch: '**/swipe.e2e.ts',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    // `pnpm run preview -- --port …` forwards the literal `--` to vite, which
    // then ignores the flags; invoke vite directly instead.
    command: `pnpm run build && pnpm exec vite preview --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
})
