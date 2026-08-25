import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { dialog, dismissVariant, makePageScrollable, openVariant } from './support/modal'

/**
 * jsdom reports every scroll metric as 0, so Phase 1 could only assert that the
 * lock configuration reached the DOM. Here the page really scrolls (or not).
 */

async function scrollY(page: Page): Promise<number> {
  return page.evaluate(() => window.scrollY)
}

async function resetScroll(page: Page): Promise<void> {
  // lab.css sets `scroll-behavior: smooth`; force an instant, settled state.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

test.describe('scroll/lock-scroll-enabled', () => {
  test('the body cannot scroll while the modal is open, and can again after', async ({ page }) => {
    await page.goto('/scroll/lock-scroll-enabled')
    await makePageScrollable(page)

    await openVariant(page)
    await resetScroll(page)

    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(400)
    expect(await scrollY(page)).toBe(0)

    await dismissVariant(page)
    await expect(dialog(page)).toBeHidden()

    await page.mouse.wheel(0, 600)
    await expect.poll(() => scrollY(page)).toBeGreaterThan(0)
  })
})

test.describe('scroll/lock-scroll-disabled', () => {
  test('the body keeps scrolling behind the open modal', async ({ page }) => {
    await page.goto('/scroll/lock-scroll-disabled')
    await makePageScrollable(page)

    await openVariant(page)
    await resetScroll(page)

    await page.mouse.wheel(0, 600)
    await expect.poll(() => scrollY(page)).toBeGreaterThan(0)
  })
})

test.describe('scroll/reserve-scroll-bar-gap-enabled', () => {
  test('the removed scrollbar width is compensated with body padding', async ({ page }) => {
    await page.goto('/scroll/reserve-scroll-bar-gap-enabled')
    await makePageScrollable(page)

    const gapBefore = await page.evaluate(
      () => window.innerWidth - document.documentElement.clientWidth,
    )
    // A real, layout-occupying scrollbar must exist — which is why this spec
    // runs in the headed chromium project (headless has overlay scrollbars).
    expect(gapBefore).toBeGreaterThan(0)

    await openVariant(page)

    const paddingRight = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.body).paddingRight),
    )
    expect(paddingRight).toBe(gapBefore)
  })
})

test.describe('scroll/reserve-scroll-bar-gap-disabled', () => {
  test('no compensation is applied, so content shifts by the scrollbar width', async ({ page }) => {
    await page.goto('/scroll/reserve-scroll-bar-gap-disabled')
    await makePageScrollable(page)

    await openVariant(page)

    const paddingRight = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.body).paddingRight),
    )
    expect(paddingRight).toBe(0)
  })
})
