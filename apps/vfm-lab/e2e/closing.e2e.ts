import { expect, test } from './support/fixtures'
import { clickOutside, content, dialog, openVariant } from './support/modal'

/**
 * Dismissal semantics with real hit-testing. Note that "outside" clicks land
 * on the modal root: the overlay itself is `pointer-events: none`.
 */

test.describe('closing/click-to-close-enabled', () => {
  test('an outside click closes; a content click never does', async ({ page }) => {
    await page.goto('/closing/click-to-close-enabled')
    await openVariant(page)

    await content(page).click()
    await page.waitForTimeout(300) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()

    await clickOutside(page)
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('closing/click-to-close-disabled', () => {
  test('outside clicks emit clickOutside but do not dismiss', async ({ page }) => {
    await page.goto('/closing/click-to-close-disabled')
    await openVariant(page)

    await expect(page.getByTestId('outside-clicks')).toHaveText('0')

    await clickOutside(page)

    await expect(page.getByTestId('outside-clicks')).toHaveText('1')
    await expect(dialog(page)).toBeVisible()

    // Escape (default true) remains the way out.
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('closing/esc-to-close-enabled', () => {
  test('Escape dismisses the modal', async ({ page }) => {
    await page.goto('/closing/esc-to-close-enabled')
    await openVariant(page)

    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('closing/esc-to-close-disabled', () => {
  test('Escape is ignored; the outside click still works', async ({ page }) => {
    await page.goto('/closing/esc-to-close-disabled')
    await openVariant(page)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()

    await clickOutside(page)
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('closing/slot-close-function', () => {
  test('the close function passed to the default slot dismisses', async ({ page }) => {
    await page.goto('/closing/slot-close-function')
    await openVariant(page)

    await page.getByTestId('slot-close').click()
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('closing/veto-lifecycle', () => {
  test('stop() in beforeOpen and beforeClose actually vetoes', async ({ page }) => {
    await page.goto('/closing/veto-lifecycle')

    // Veto the open.
    await page.getByTestId('block-open').click()
    await page.getByTestId('trigger').click()
    await page.waitForTimeout(400) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeHidden()

    // Allow the open, veto the close. The page buttons are under the modal,
    // so the toggles are driven with dispatched events, not real pointers.
    await page.getByTestId('block-open').click()
    await openVariant(page)
    await page.getByTestId('block-close').dispatchEvent('click')

    await dialog(page).getByTestId('content-close').click()
    await page.waitForTimeout(400) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()

    // Lift the veto; now it closes.
    await page.getByTestId('block-close').dispatchEvent('click')
    await dialog(page).getByTestId('content-close').click()
    await expect(dialog(page)).toBeHidden()
  })
})
