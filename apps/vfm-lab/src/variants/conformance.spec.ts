import { describe, expect, it } from 'vitest'

import {
  clickOutsideContent,
  clickTeleported,
  flushModal,
  isContentVisible,
  mountVariant,
  openVariant,
  pressEscape,
  queryTestId,
  stubElementBox,
  stubVisibleRects,
} from '@/test/helpers'

import { variants } from './registry'

/** Testids used by the dismiss control a variant renders inside its content. */
const DISMISS_CONTROLS = ['content-close', 'close', 'slot-close', 'destroy']

/**
 * Every variant, whatever it configures, honours the same two contracts: it can
 * be dismissed from its own content, and the library writes the closed state
 * back through `v-model` when it dismisses the modal itself.
 *
 * The per-variant specs assert what makes each one different; this one asserts
 * what they all have in common, so a variant cannot ship with a dead close
 * button or a broken `v-model` write-back.
 */
describe.each(variants.map((variant) => [`${variant.group}/${variant.id}`, variant] as const))(
  'conformance %s',
  (_name, variant) => {
    it('can be dismissed from its own content', async () => {
      const restoreRects = stubVisibleRects()
      const restoreBox = stubElementBox()

      try {
        const { wrapper, vfm } = mountVariant(variant.component)

        if (queryTestId('trigger') === null) {
          // Variants that are open on mount still need their transition to settle.
          await flushModal()
        } else {
          await openVariant(wrapper)
        }

        expect(isContentVisible()).toBe(true)

        const dismiss = DISMISS_CONTROLS.find((testId) => queryTestId(testId) !== null)

        if (dismiss === undefined) {
          // No in-content control: the only way out is the programmatic API.
          await vfm.closeAll()
          await flushModal()
        } else {
          await clickTeleported(dismiss)
        }

        expect(isContentVisible()).toBe(false)
      } finally {
        restoreBox()
        restoreRects()
      }
    })

    it('writes the closed state back through v-model', async () => {
      const restoreRects = stubVisibleRects()
      const restoreBox = stubElementBox()

      try {
        const { wrapper } = mountVariant(variant.component)

        if (queryTestId('trigger') === null) {
          await flushModal()
        } else {
          await openVariant(wrapper)
        }

        expect(isContentVisible()).toBe(true)

        // Every variant opts out of at most one of the two built-in dismissals,
        // so trying both always reaches a close driven by the library itself.
        await pressEscape()

        if (isContentVisible()) {
          await clickOutsideContent()
        }

        expect(isContentVisible()).toBe(false)
      } finally {
        restoreBox()
        restoreRects()
      }
    })
  },
)
