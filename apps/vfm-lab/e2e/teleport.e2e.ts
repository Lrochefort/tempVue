import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { dialog, dismissVariant, openVariant } from './support/modal'

/** Tag/id description of the `.vfm` root's real DOM parent. */
async function vfmParent(page: Page): Promise<{ tag: string; id: string; testid?: string }> {
  return page.evaluate(() => {
    const parent = document.querySelector('.vfm')?.parentElement
    return {
      tag: parent?.tagName ?? '',
      id: parent?.id ?? '',
      testid: (parent as HTMLElement | null)?.dataset['testid'],
    }
  })
}

test.describe('teleport/teleport-default', () => {
  test('the modal lands on document.body', async ({ page }) => {
    await page.goto('/teleport/teleport-default')
    await openVariant(page)

    expect((await vfmParent(page)).tag).toBe('BODY')
  })
})

test.describe('teleport/teleport-to-body', () => {
  test('an explicit body target behaves like the default', async ({ page }) => {
    await page.goto('/teleport/teleport-to-body')
    await openVariant(page)

    expect((await vfmParent(page)).tag).toBe('BODY')
  })
})

test.describe('teleport/teleport-to-selector', () => {
  test('the modal is placed inside the selector target and still works', async ({ page }) => {
    await page.goto('/teleport/teleport-to-selector')
    await openVariant(page)

    expect((await vfmParent(page)).id).toBe('vfm-lab-teleport-target')

    await dismissVariant(page)
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('teleport/teleport-disabled', () => {
  test('the modal renders inline in the component tree and still works', async ({ page }) => {
    await page.goto('/teleport/teleport-disabled')
    await openVariant(page)

    const inline = await page.evaluate(() => {
      const demo = document.querySelector('[data-testid="variant-demo"]')
      const vfm = document.querySelector('.vfm')
      return demo !== null && vfm !== null && demo.contains(vfm)
    })
    expect(inline).toBe(true)

    // position: fixed keeps it viewport-sized even when not teleported.
    await expect(dialog(page)).toBeVisible()

    await dismissVariant(page)
    await expect(dialog(page)).toBeHidden()
  })
})
