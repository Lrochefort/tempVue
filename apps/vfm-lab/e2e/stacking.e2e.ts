import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { dialog, openVariant, overlay, settleTransitions } from './support/modal'

/**
 * Phase 1 could assert z-index strings but never paint order. Here stacking is
 * proven by hit-testing: whatever `elementFromPoint` returns at the shared
 * center is what the user would actually click.
 */

/** 0-based index of the `.vfm` root that owns the element at the viewport center of the top content. */
async function hitModalIndex(page: Page): Promise<number> {
  return page.evaluate(() => {
    const roots = [...document.querySelectorAll('.vfm')]
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    return roots.findIndex((root) => el !== null && root.contains(el))
  })
}

test.describe('zindex/zindex-default', () => {
  test('the default formula yields 1000 for the first modal', async ({ page }) => {
    await page.goto('/zindex/zindex-default')
    await openVariant(page)

    await expect(page.locator('.vfm')).toHaveCSS('z-index', '1000')
  })
})

test.describe('zindex/zindex-custom', () => {
  test('a custom zIndexFn replaces the formula', async ({ page }) => {
    await page.goto('/zindex/zindex-custom')
    await openVariant(page)

    await expect(page.locator('.vfm')).toHaveCSS('z-index', '5000')
  })
})

test.describe('zindex/zindex-stacked', () => {
  test('stacked modals paint in opening order and unwind on close', async ({ page }) => {
    await page.goto('/zindex/zindex-stacked')

    await page.getByTestId('trigger').click()
    await expect(dialog(page).first()).toBeVisible()
    // The page buttons sit under the open modal, unreachable by a real
    // pointer; stacking is driven with dispatched events instead.
    await page.getByTestId('trigger-second').dispatchEvent('click')
    await page.getByTestId('trigger-third').dispatchEvent('click')
    await expect(dialog(page)).toHaveCount(3)
    await settleTransitions(page)

    const zIndexes = await page.evaluate(() =>
      [...document.querySelectorAll('.vfm')].map((el) => (el as HTMLElement).style.zIndex),
    )
    expect(zIndexes).toEqual(['1000', '1002', '1004'])

    // Paint order, not just numbers: the third modal owns the center.
    expect(await hitModalIndex(page)).toBe(2)

    await page.locator('.vfm').nth(2).getByTestId('content-close').click()
    await expect(dialog(page)).toHaveCount(2)
    expect(await hitModalIndex(page)).toBe(1)
  })
})

test.describe('zindex/zindex-reset-on-close', () => {
  test('a reopened modal starts back at the bottom of the formula', async ({ page }) => {
    await page.goto('/zindex/zindex-reset-on-close')
    await openVariant(page)
    await expect(page.locator('.vfm')).toHaveCSS('z-index', '1000')

    await dialog(page).getByTestId('content-close').click()
    await expect(dialog(page)).toBeHidden()

    await openVariant(page)
    await expect(page.locator('.vfm')).toHaveCSS('z-index', '1000')
  })
})

test.describe('overlay/overlay-default', () => {
  test('a visible backdrop accompanies the content', async ({ page }) => {
    await page.goto('/overlay/overlay-default')
    await openVariant(page)

    await expect(overlay(page)).toBeVisible()
  })
})

test.describe('overlay/overlay-hidden', () => {
  test('no backdrop element is rendered at all', async ({ page }) => {
    await page.goto('/overlay/overlay-hidden')
    await openVariant(page)

    await expect(dialog(page)).toBeVisible()
    await expect(overlay(page)).toHaveCount(0)
  })
})

test.describe('overlay/overlay-behavior-auto', () => {
  test('the lower overlay is dropped while a second modal stacks on top', async ({ page }) => {
    await page.goto('/overlay/overlay-behavior-auto')
    await page.getByTestId('trigger').click()
    await expect(dialog(page).first()).toBeVisible()
    await expect(overlay(page)).toHaveCount(1)

    await page.getByTestId('trigger-second').dispatchEvent('click')
    await expect(dialog(page)).toHaveCount(2)

    // displayDirective is `if`: the overlay `auto` hides leaves the DOM once
    // its fade-out finishes. Auto-retrying on count absorbs the transition.
    await expect(overlay(page)).toHaveCount(1)

    await page.getByTestId('close-second').dispatchEvent('click')
    await expect(dialog(page)).toHaveCount(1)
    await expect(overlay(page)).toHaveCount(1)
  })
})

test.describe('overlay/overlay-behavior-persist', () => {
  test('every stacked modal keeps its own overlay', async ({ page }) => {
    await page.goto('/overlay/overlay-behavior-persist')
    await page.getByTestId('trigger').click()
    await expect(dialog(page).first()).toBeVisible()
    await page.getByTestId('trigger-second').dispatchEvent('click')
    await expect(dialog(page)).toHaveCount(2)
    await settleTransitions(page)

    await expect(overlay(page)).toHaveCount(2)
    const visibleOverlays = await page.evaluate(
      () =>
        [...document.querySelectorAll('.vfm__overlay')].filter((el) => {
          const rect = el.getBoundingClientRect()
          return rect.width > 0 && getComputedStyle(el).display !== 'none'
        }).length,
    )
    expect(visibleOverlays).toBe(2)
  })
})

test.describe('overlay/overlay-custom-appearance', () => {
  test('overlayClass and overlayStyle land on the real backdrop', async ({ page }) => {
    await page.goto('/overlay/overlay-custom-appearance')
    await openVariant(page)

    const backdrop = overlay(page)
    await expect(backdrop).toHaveClass(/lab-overlay--tinted/)
    await expect(backdrop).toHaveCSS('background-color', 'rgb(10, 20, 30)')
    await expect(backdrop).toHaveCSS('opacity', '0.8')
  })
})

test.describe('focus/background-interactive', () => {
  test('the page behind the modal stays clickable', async ({ page }) => {
    await page.goto('/focus/background-interactive')
    await openVariant(page)

    // The header link is guaranteed clear of the centered content box; with
    // pointer-events disabled on the modal root it must be the real hit target …
    const hit = await page.getByTestId('home-link').evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
      return target !== null && (target === el || el.contains(target))
    })
    expect(hit).toBe(true)

    // … and a real click on it must go through (navigates home).
    await page.getByTestId('home-link').click({ timeout: 2_000 })
    await expect(page.getByTestId('home')).toBeVisible()
  })
})

test.describe('focus/background-non-interactive', () => {
  test('the modal root blocks the page underneath', async ({ page }) => {
    await page.goto('/focus/background-non-interactive')
    await openVariant(page)

    const hit = await page.getByTestId('home-link').evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
      return target !== null && (target === el || el.contains(target))
    })
    expect(hit).toBe(false)
  })
})
