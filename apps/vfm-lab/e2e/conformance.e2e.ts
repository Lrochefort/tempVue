import { expect, test } from './support/fixtures'
import {
  dialog,
  dismissVariant,
  expectHitTestable,
  focusedTestId,
  openVariant,
  settleTransitions,
} from './support/modal'
import { allVariants } from './support/variants'

/**
 * The e2e twin of `src/variants/conformance.spec.ts`: every variant, whatever
 * it configures, must render its page cleanly, open a real dialog, be
 * hit-testable, and reach a genuinely dismissed state — in a real browser.
 *
 * The console-error fixture is active on every test, so a variant that renders
 * but logs errors fails here too.
 */

const variants = allVariants()

test.describe('gallery integrity', () => {
  test('the fs-enumerated variants match the live gallery', async ({ page }) => {
    await page.goto('/')

    const counts = new Map<string, number>()
    for (const variant of variants) {
      counts.set(variant.group, (counts.get(variant.group) ?? 0) + 1)
    }

    for (const [group, count] of counts) {
      await expect(page.getByTestId(`group-count-${group}`)).toHaveText(String(count))
    }

    const groupLinks = await page.locator('[data-testid^="group-link-"]').count()
    expect(groupLinks).toBe(counts.size)
  })
})

for (const variant of variants) {
  test.describe(`${variant.group}/${variant.id}`, () => {
    test('opens, is hit-testable, dismisses, and restores focus', async ({ page }) => {
      await page.goto(variant.route)
      await expect(page.getByTestId('variant')).toBeVisible()
      await expect(page.getByTestId('variant-demo').getByTestId('trigger')).toBeVisible()

      const openedByClick = await openVariant(page)
      const modal = dialog(page).first()
      await expect(modal).toBeVisible()
      await settleTransitions(page)
      await expectHitTestable(modal.locator('.vfm__content'))

      await dismissVariant(page)
      await expect(dialog(page)).toBeHidden()

      // focus-trap returns focus to the opener; only meaningful when the
      // modal was opened by clicking it, and never when the trap is off.
      if (openedByClick && variant.id !== 'focus-trap-disabled') {
        expect(await focusedTestId(page)).toBe('trigger')
      }
    })
  })
}
