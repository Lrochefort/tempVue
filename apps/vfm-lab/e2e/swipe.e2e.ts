import type { Locator, Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import {
  centerOf,
  content,
  dialog,
  mouseSwipe,
  openVariant,
  suppressTextSelection,
  touchSwipe,
  type Point,
} from './support/modal'

type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * Phase 1 drove the swipe with stubbed element boxes and synthetic events.
 * Here the gestures are real — discrete mouse drags on desktop and trusted
 * CDP touch input on the mobile project — against real layout.
 *
 * Three library behaviours dictate how gestures must be produced:
 *
 * - Moves must be discrete events; interpolated moves outrun Vue's per-event
 *   transform updates.
 * - The gesture must start at the edge OPPOSITE the drag direction: the sheet
 *   only follows the pointer once the threshold is passed, and the swipe
 *   listeners sit on the sheet itself, so a pointer that walks off the element
 *   silently ends the gesture.
 * - A drag that selects text is aborted via the library's `selectionchange`
 *   guard — pinned as its own test below; closing gestures disable selection
 *   the way a real swipeable sheet would.
 */

/** A start point on the sheet's padding, opposite the drag direction. */
async function edgeStart(target: Locator, direction: Direction): Promise<Point> {
  const box = await target.boundingBox()
  if (!box) throw new Error('Content has no bounding box.')

  switch (direction) {
    case 'up':
      return { x: box.x + box.width / 2, y: box.y + box.height - 8 }
    case 'down':
      return { x: box.x + box.width / 2, y: box.y + 8 }
    case 'left':
      return { x: box.x + box.width - 8, y: box.y + box.height / 2 }
    case 'right':
      return { x: box.x + 8, y: box.y + box.height / 2 }
  }
}

function endpoint(from: Point, direction: Direction, distance: number): Point {
  switch (direction) {
    case 'up':
      return { x: from.x, y: from.y - distance }
    case 'down':
      return { x: from.x, y: from.y + distance }
    case 'left':
      return { x: from.x - distance, y: from.y }
    case 'right':
      return { x: from.x + distance, y: from.y }
  }
}

async function swipe(page: Page, direction: Direction, distance: number): Promise<void> {
  await suppressTextSelection(page)
  const from = await edgeStart(content(page).first(), direction)
  const to = endpoint(from, direction, distance)

  if (test.info().project.name === 'mobile-chromium') {
    await touchSwipe(page, from, to)
  } else {
    await mouseSwipe(page, from, to)
  }
}

for (const direction of ['up', 'down', 'left', 'right'] as const) {
  test.describe(`swipe/swipe-to-close-${direction}`, () => {
    test(`a real ${direction}ward drag dismisses the modal`, async ({ page }) => {
      await page.goto(`/swipe/swipe-to-close-${direction}`)
      await openVariant(page)

      await swipe(page, direction, 120)
      await expect(dialog(page)).toBeHidden()
    })

    test('dragging the opposite way does nothing', async ({ page }) => {
      await page.goto(`/swipe/swipe-to-close-${direction}`)
      await openVariant(page)

      const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' } as const
      await swipe(page, opposite[direction], 120)

      await page.waitForTimeout(400) // deliberate: asserting nothing happened
      await expect(dialog(page)).toBeVisible()
    })
  })
}

test.describe('swipe/swipe-to-close-none', () => {
  test('no direction dismisses the modal', async ({ page }) => {
    await page.goto('/swipe/swipe-to-close-none')
    await openVariant(page)

    await swipe(page, 'up', 120)
    await page.waitForTimeout(400) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe('swipe/swipe-threshold', () => {
  test('a drag below the threshold is ignored, one beyond it closes', async ({ page }) => {
    await page.goto('/swipe/swipe-threshold')
    await openVariant(page)

    // threshold: 120 — a 60px drag never even counts as a swipe.
    await swipe(page, 'down', 60)
    await page.waitForTimeout(400) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()

    await swipe(page, 'down', 260)
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe('mouse swipe vs text selection', () => {
  test('a drag that selects text aborts the gesture (library guard)', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chromium', 'touch drags never select text')

    await page.goto('/swipe/swipe-to-close-up')
    await openVariant(page)

    // Straight across the paragraph, no selection suppression.
    const from = await centerOf(content(page).first())
    await mouseSwipe(page, from, { x: from.x, y: from.y - 150 })

    await page.waitForTimeout(400) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe('swipe/swipe-banner-default', () => {
  test('the banner owns the gesture; the content itself is not swipeable', async ({ page }) => {
    await page.goto('/swipe/swipe-banner-default')
    await openVariant(page)

    await expect(page.locator('.vfm-swipe-banner-container')).toBeAttached()

    // With a banner, dragging the sheet body must NOT close the modal — that
    // is exactly what showSwipeBanner exists for. The gesture starts at the
    // content CENTER: on narrow viewports the sheet's padding edge sits under
    // the banner's edge strip, which IS swipeable by design.
    await suppressTextSelection(page)
    const from = await centerOf(content(page).first())
    const to = { x: from.x + 120, y: from.y }

    if (test.info().project.name === 'mobile-chromium') {
      await touchSwipe(page, from, to)
    } else {
      await mouseSwipe(page, from, to)
    }

    await page.waitForTimeout(400) // deliberate: asserting nothing happened
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe('swipe/swipe-banner-slot', () => {
  test('the swipe-banner slot replaces the banner markup', async ({ page }) => {
    await page.goto('/swipe/swipe-banner-slot')
    await openVariant(page)

    await expect(page.getByTestId('custom-banner')).toBeAttached()
  })
})

test.describe('swipe/prevent-navigation-gestures', () => {
  test('edge strips swallow the touchstart that would start a navigation gesture', async ({
    page,
  }) => {
    await page.goto('/swipe/prevent-navigation-gestures')
    await openVariant(page)

    const strips = page.locator('.vfm-swipe-banner-back, .vfm-swipe-banner-forward')
    await expect(strips).toHaveCount(2)

    // The mechanism is preventDefault on the strip's touchstart.
    const prevented = await page.locator('.vfm-swipe-banner-back').evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const touch = new Touch({
        identifier: 1,
        target: el,
        clientX: rect.x + 1,
        clientY: rect.y + rect.height / 2,
      })
      const event = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      })
      el.dispatchEvent(event)
      return event.defaultPrevented
    })

    expect(prevented).toBe(true)
  })
})
