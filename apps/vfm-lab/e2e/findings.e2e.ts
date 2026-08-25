import { expect, test } from './support/fixtures'
import { dialog, openVariant } from './support/modal'

/**
 * Real-browser verdicts for the defects Phase 1 found under jsdom (F1–F5 in
 * apps/vfm-lab/README.md). Each spec IS the reproduction; if the library ever
 * fixes the defect, the spec fails and the finding gets retired.
 *
 * The app exposes its Vfm instance as `window.__vfm` for exactly this purpose.
 *
 * - F3 is adjudicated in transitions.e2e.ts (appear never runs).
 * - F4 (the -0 swipe offset) needs an element with a zero-sized box at gesture
 *   start; with real layout the box is never zero, so the jsdom repro does not
 *   transfer. Verdict recorded in the README instead.
 * - F5 (getModalExposed returns a ComputedRef) is an API-shape fact with no
 *   browser dimension; the unit spec remains its reproduction.
 */

interface VfmLike {
  open: (id: string) => Promise<string>
  close: (id: string) => Promise<string>
}

const MODAL_ID = 'display-modal-id-programmatic'

test.describe('F1 — vfm.open() on an already-open modal never settles', () => {
  test('the second open() promise deadlocks in a real browser too', async ({ page }) => {
    await page.goto('/display/modal-id-programmatic')
    await openVariant(page)

    const outcome = await page.evaluate(async (id) => {
      const vfm = (window as Window & { __vfm?: VfmLike }).__vfm
      if (!vfm) return 'no-vfm'

      return Promise.race([
        vfm.open(id).then((value: string) => `settled: ${value}`),
        new Promise<string>((resolve) => setTimeout(() => resolve('deadlocked'), 1_500)),
      ])
    }, MODAL_ID)

    // CONFIRMED IN CHROMIUM: the promise never settles.
    expect(outcome).toBe('deadlocked')
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe('F2 — close() interleaved with open() resolves with a stale value', () => {
  test('close() immediately after open() reports the open transition, not the close', async ({
    page,
  }) => {
    await page.goto('/display/modal-id-programmatic')

    const outcome = await page.evaluate(async (id) => {
      const vfm = (window as Window & { __vfm?: VfmLike }).__vfm
      if (!vfm) return 'no-vfm'

      void vfm.open(id)
      // No flush between the two calls — the exact interleaving from F2.
      return vfm.close(id)
    }, MODAL_ID)

    // CONFIRMED IN CHROMIUM: the close() promise resolves with "opened".
    expect(outcome).toBe('opened')
  })
})
