import { expect, test } from './support/fixtures'
import { dialog, openVariant, overlay } from './support/modal'

/**
 * A light accessibility pass over one representative variant per group. The
 * deep per-behaviour checks live in the focused specs; this asserts the ARIA
 * contract every modal must honour, plus keyboard-only operability.
 */

const REPRESENTATIVES = [
  'closing/esc-to-close-enabled',
  'composition/use-modal-basic',
  'display/display-if',
  'focus/focus-trap-default',
  'overlay/overlay-default',
  'scroll/lock-scroll-enabled',
  'styling/content-class-string',
  'swipe/swipe-to-close-none',
  'teleport/teleport-default',
  'transitions/transition-fade',
  'zindex/zindex-default',
]

for (const route of REPRESENTATIVES) {
  test.describe(`a11y ${route}`, () => {
    test('exposes the dialog ARIA contract', async ({ page }) => {
      await page.goto(`/${route}`)
      await openVariant(page)

      const modal = dialog(page).first()
      await expect(modal).toBeVisible()
      await expect(modal).toHaveAttribute('role', 'dialog')
      await expect(modal).toHaveAttribute('aria-modal', 'true')

      // The decorative backdrop must be hidden from assistive tech.
      if ((await overlay(page).count()) > 0) {
        await expect(overlay(page).first()).toHaveAttribute('aria-hidden', 'true')
      }
    })
  })
}

test.describe('a11y keyboard-only operation', () => {
  test('a modal can be opened and closed without a pointer', async ({ page }) => {
    await page.goto('/closing/esc-to-close-enabled')

    await page.getByTestId('trigger').focus()
    await page.keyboard.press('Enter')
    await expect(dialog(page)).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()

    // Focus lands back on the opener, ready for the next keystroke.
    await expect(page.getByTestId('trigger')).toBeFocused()
  })
})
