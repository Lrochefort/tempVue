import { expect, type Locator, type Page } from '@playwright/test'

/** The modal root the library renders: `div.vfm[role=dialog][aria-modal=true]`. */
export function dialog(page: Page): Locator {
  return page.locator('div[role="dialog"][aria-modal="true"]')
}

export function overlay(page: Page): Locator {
  return page.locator('.vfm__overlay')
}

export function content(page: Page): Locator {
  return page.locator('.vfm__content')
}

/**
 * Opens the variant's modal unless it is already open on load (initially-open
 * variants). Returns whether the trigger was actually clicked.
 */
export async function openVariant(page: Page): Promise<boolean> {
  if (await dialog(page).first().isVisible()) return false

  await page.getByTestId('trigger').click()
  await expect(dialog(page).first()).toBeVisible()
  return true
}

/**
 * Every variant documents its own way out; these are tried in order. The
 * in-content close (rendered by ModalBody) comes first because it is the
 * common case; the rest are the per-variant programmatic controls.
 */
export const DISMISS_CONTROLS = [
  'content-close',
  'slot-close',
  'close',
  'external-close',
  'close-by-id',
  'close-all',
  'destroy',
  'toggle-exposed',
] as const

/** Clicks the variant's documented dismiss control, or falls back to Escape. */
export async function dismissVariant(page: Page): Promise<string> {
  const modal = dialog(page).first()

  // Controls inside the dialog are always reachable; try them first.
  for (const testId of DISMISS_CONTROLS) {
    const inDialog = modal.getByTestId(testId)

    if ((await inDialog.count()) > 0 && (await inDialog.first().isVisible())) {
      await inDialog.first().click()
      return testId
    }
  }

  // Page-level controls may be occluded by the overlay (the overlay is the
  // point of a modal); attempt briefly, then fall back to the keyboard.
  for (const testId of DISMISS_CONTROLS) {
    const control = page.getByTestId(testId)

    if ((await control.count()) > 0 && (await control.first().isVisible())) {
      try {
        await control.first().click({ timeout: 1_500 })
        return testId
      } catch {
        break
      }
    }
  }

  await page.keyboard.press('Escape')
  return 'Escape'
}

export interface Point {
  x: number
  y: number
}

/**
 * Clicks "outside" the content. The overlay itself has `pointer-events: none`
 * (`vfm--prevent-none`); the element that actually receives outside clicks is
 * the modal root, so that is what gets clicked, in its top-left corner where
 * no content can be.
 */
export async function clickOutside(page: Page): Promise<void> {
  await dialog(page)
    .first()
    .click({ position: { x: 10, y: 10 } })
}

/**
 * The library aborts a mouse swipe as soon as `selectionchange` reports a
 * non-collapsed selection, and a drag across text selects it. Real swipeable
 * sheets set `user-select: none`; tests that need a completed mouse gesture
 * apply the same accommodation explicitly.
 */
export async function suppressTextSelection(page: Page): Promise<void> {
  await content(page)
    .first()
    .evaluate((el) => {
      ;(el as HTMLElement).style.userSelect = 'none'
    })
}

/**
 * Drives a swipe with discrete mouse events. Two things matter here, both
 * learned the hard way:
 *
 * - Each step must be its own `mouse.move` call. Interpolated moves
 *   (`steps: n`) outrun Vue's per-event transform updates and the gesture
 *   direction watcher concludes the pointer reversed.
 * - The drag must not select text: the library aborts a swipe as soon as
 *   `selectionchange` reports a non-collapsed selection. Callers should start
 *   the gesture on a padding area, not on a text node.
 */
export async function mouseSwipe(page: Page, from: Point, to: Point, steps = 6): Promise<void> {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()

  const dx = (to.x - from.x) / steps
  const dy = (to.y - from.y) / steps

  for (let step = 1; step <= steps; step++) {
    await page.mouse.move(from.x + dx * step, from.y + dy * step)
  }

  await page.mouse.up()
}

/**
 * Drives a swipe with real (trusted) touch input through the CDP
 * `Input.dispatchTouchEvent` domain. Chromium only — which is the browser
 * matrix of this suite.
 */
export async function touchSwipe(page: Page, from: Point, to: Point, steps = 6): Promise<void> {
  const cdp = await page.context().newCDPSession(page)

  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: from.x, y: from.y }],
  })

  const dx = (to.x - from.x) / steps
  const dy = (to.y - from.y) / steps

  for (let step = 1; step <= steps; step++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: from.x + dx * step, y: from.y + dy * step }],
    })
  }

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
}

/** Returns the center of a locator's bounding box, failing if it has none. */
export async function centerOf(locator: Locator): Promise<Point> {
  const box = await locator.boundingBox()

  if (!box) throw new Error('Element has no bounding box.')

  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

/** Appends a tall spacer so the page genuinely scrolls. */
export async function makePageScrollable(page: Page): Promise<void> {
  await page.evaluate(() => {
    const spacer = document.createElement('div')
    spacer.style.height = '3000px'
    spacer.dataset['testid'] = 'tall-spacer'
    document.body.append(spacer)
  })
}

/** data-testid of whatever element currently holds focus. */
export async function focusedTestId(page: Page): Promise<string | undefined> {
  return page.evaluate(() => (document.activeElement as HTMLElement | null)?.dataset['testid'])
}

/** Waits until neither modal layer is mid-transition. */
export async function settleTransitions(page: Page): Promise<void> {
  await expect(content(page).first()).not.toHaveClass(/-enter-active|-leave-active/, {
    timeout: 5_000,
  })
}

/** Asserts the element at the locator's center is the locator (or inside it). */
export async function expectHitTestable(locator: Locator): Promise<void> {
  const { x, y } = await centerOf(locator)
  const page = locator.page()

  const hit = await page.evaluate(
    (point) => {
      const el = document.elementFromPoint(point.x, point.y)
      return el ? { className: el.className, tag: el.tagName } : null
    },
    { x, y },
  )

  expect(hit).not.toBeNull()

  const isInside = await locator.evaluate(
    (el, point) => {
      const target = document.elementFromPoint(point.x, point.y)
      return target !== null && (el === target || el.contains(target))
    },
    { x, y },
  )

  expect(isInside).toBe(true)
}
