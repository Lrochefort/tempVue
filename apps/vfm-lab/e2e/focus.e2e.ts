import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { dialog, openVariant } from './support/modal'

/**
 * Phase 1 could not activate focus-trap at all under jsdom (no layout, no
 * tabbable detection). These specs retire that caveat with real focus.
 */

/** True when the currently focused element lives inside the modal root. */
async function focusIsInsideDialog(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const root = document.querySelector('div[role="dialog"][aria-modal="true"]')
    return root !== null && document.activeElement !== null && root.contains(document.activeElement)
  })
}

test.describe('focus/focus-trap-default', () => {
  test('activates, contains Tab and Shift+Tab, and releases on close', async ({ page }) => {
    await page.goto('/focus/focus-trap-default')
    await openVariant(page)

    // The library focuses the content element as soon as the modal opens.
    expect(await focusIsInsideDialog(page)).toBe(true)

    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab')
      expect(await focusIsInsideDialog(page)).toBe(true)
    }

    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Shift+Tab')
      expect(await focusIsInsideDialog(page)).toBe(true)
    }

    await dialog(page).getByTestId('content-close').click()
    await expect(dialog(page)).toBeHidden()
    await expect(page.getByTestId('trigger')).toBeFocused()
  })
})

test.describe('focus/focus-trap-disabled', () => {
  test('focus can leave the modal', async ({ page }) => {
    await page.goto('/focus/focus-trap-disabled')
    await openVariant(page)

    // Without a trap, tabbing walks out of the modal in a handful of steps.
    let escaped = false
    for (let i = 0; i < 6 && !escaped; i++) {
      await page.keyboard.press('Tab')
      escaped = !(await focusIsInsideDialog(page))
    }

    expect(escaped).toBe(true)
  })
})

test.describe('focus/focus-trap-options', () => {
  test('forwarded options still confine Tab', async ({ page }) => {
    await page.goto('/focus/focus-trap-options')
    await openVariant(page)

    expect(await focusIsInsideDialog(page)).toBe(true)

    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab')
      expect(await focusIsInsideDialog(page)).toBe(true)
    }

    await dialog(page).getByTestId('content-close').click()
    await expect(dialog(page)).toBeHidden()
  })
})
