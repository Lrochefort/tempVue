import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { dialog, openVariant, settleTransitions } from './support/modal'

/**
 * jsdom has no animation timing, so Phase 1 could not see a transition run.
 * A MutationObserver records every class that appears on the modal layers,
 * which is deterministic regardless of how fast the transition plays.
 */

declare global {
  interface Window {
    __classLog?: string[]
  }
}

async function recordTransitionClasses(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__classLog = []
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          window.__classLog?.push((mutation.target as HTMLElement).className)
        } else {
          // Enter-from/-active classes are present at insertion time and never
          // arrive as an attribute mutation; capture added subtrees too.
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue
            const el = node as HTMLElement
            window.__classLog?.push(el.className)
            for (const child of el.querySelectorAll('*')) {
              window.__classLog?.push((child as HTMLElement).className)
            }
          }
        }
      }
    })
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
    })
  })
}

async function recordedClasses(page: Page): Promise<string> {
  return page.evaluate(() => (window.__classLog ?? []).join('\n'))
}

test.describe('transitions/transition-fade', () => {
  test('enter and leave phases really play on both layers', async ({ page }) => {
    await page.goto('/transitions/transition-fade')
    await recordTransitionClasses(page)

    await openVariant(page)
    await settleTransitions(page)

    let log = await recordedClasses(page)
    expect(log).toContain('vfm__overlay')
    expect(log).toMatch(/vfm__overlay.*vfm-fade-enter-active/)
    expect(log).toMatch(/vfm__content.*vfm-fade-enter-active/)

    // Once settled the transition classes are gone again.
    await expect(page.locator('.vfm__content')).not.toHaveClass(/vfm-fade-enter/)

    await dialog(page).getByTestId('content-close').click()
    await expect(dialog(page)).toBeHidden()

    log = await recordedClasses(page)
    expect(log).toMatch(/vfm__content.*vfm-fade-leave-active/)
  })
})

for (const direction of ['up', 'down', 'left', 'right'] as const) {
  test.describe(`transitions/transition-slide-${direction}`, () => {
    test('the slide preset plays and settles', async ({ page }) => {
      await page.goto(`/transitions/transition-slide-${direction}`)
      await recordTransitionClasses(page)

      await openVariant(page)
      await settleTransitions(page)

      const log = await recordedClasses(page)
      expect(log).toMatch(new RegExp(`vfm__content.*vfm-slide-${direction}-enter-active`))

      await expect(page.locator('.vfm__content')).not.toHaveClass(/enter-active/)
    })
  })
}

test.describe('transitions/transition-custom-object', () => {
  test('per-phase classes from a TransitionProps object are honoured', async ({ page }) => {
    await page.goto('/transitions/transition-custom-object')
    await recordTransitionClasses(page)

    await openVariant(page)
    await settleTransitions(page)

    let log = await recordedClasses(page)
    expect(log).toContain('lab-zoom--from')
    expect(log).toContain('lab-zoom--entering')

    await dialog(page).getByTestId('content-close').click()
    await expect(dialog(page)).toBeHidden()

    // Phases not overridden fall back to name-derived classes.
    log = await recordedClasses(page)
    expect(log).toContain('lab-zoom-leave-active')
  })
})

const nameOf = (line: string): string | undefined => /(\S+)-enter-active/.exec(line)?.[1]

test.describe('transitions/transition-separate-layers', () => {
  test('overlay and content play different transitions', async ({ page }) => {
    await page.goto('/transitions/transition-separate-layers')
    await recordTransitionClasses(page)

    await openVariant(page)
    await settleTransitions(page)

    const log = await recordedClasses(page)
    const overlayLines = log.split('\n').filter((line) => line.includes('vfm__overlay'))
    const contentLines = log.split('\n').filter((line) => line.includes('vfm__content'))

    const overlayTransition = overlayLines.find((line) => /-enter-active/.test(line))
    const contentTransition = contentLines.find((line) => /-enter-active/.test(line))

    expect(overlayTransition).toBeDefined()
    expect(contentTransition).toBeDefined()

    expect(nameOf(overlayTransition ?? '')).not.toBe(nameOf(contentTransition ?? ''))
  })
})

test.describe('transitions/transition-appear (F3)', () => {
  test('the appear phase never runs; the regular enter transition plays instead', async ({
    page,
  }) => {
    // The modal is open on first render, so the observer must exist before
    // the app boots.
    await page.addInitScript(() => {
      window.__classLog = []
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes') {
            window.__classLog?.push((mutation.target as HTMLElement).className)
          } else {
            for (const node of mutation.addedNodes) {
              if (node.nodeType !== Node.ELEMENT_NODE) continue
              const el = node as HTMLElement
              window.__classLog?.push(el.className)
              for (const child of el.querySelectorAll('*')) {
                window.__classLog?.push((child as HTMLElement).className)
              }
            }
          }
        }
      })
      const start = (): void => {
        observer.observe(document.body, {
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
          childList: true,
        })
      }
      if (document.body) start()
      else document.addEventListener('DOMContentLoaded', start)
    })

    await page.goto('/transitions/transition-appear')
    await expect(dialog(page)).toBeVisible()
    await settleTransitions(page)

    const log = await recordedClasses(page)

    // F3 confirmed when the explicit appear classes never showed up …
    expect(log).not.toContain('lab-appear--from')
    expect(log).not.toContain('lab-appear--active')
    // … while the regular enter transition did.
    expect(log).toMatch(/vfm-fade-enter-active/)
  })
})
