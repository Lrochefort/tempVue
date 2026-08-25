import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  closeFromContent,
  isContentVisible,
  mountVariant,
  openVariant,
  queryContent,
  stubVisibleRects,
} from '@/test/helpers'

import FocusTrapDefault from './FocusTrapDefault.vue'

// Passing `focusTrap: undefined` cancels the harness default so the library's own
// default (`{ allowOutsideClick: true }`) applies.
const useDefaultTrap = { attrs: { focusTrap: undefined } }

describe('focus/focus-trap-default', () => {
  let restoreRects: () => void

  beforeEach(() => {
    restoreRects = stubVisibleRects()
  })

  afterEach(() => {
    restoreRects()
  })

  it('opens with the library default focus trap active', async () => {
    const { wrapper } = mountVariant(FocusTrapDefault, useDefaultTrap)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })

  it('moves focus into the modal content', async () => {
    const { wrapper } = mountVariant(FocusTrapDefault, useDefaultTrap)

    await openVariant(wrapper)

    expect(document.activeElement).toBe(queryContent())
  })

  it('releases focus when the modal closes', async () => {
    const { wrapper } = mountVariant(FocusTrapDefault, useDefaultTrap)
    await openVariant(wrapper)

    await closeFromContent()

    expect(queryContent()).toBeNull()
    expect(document.activeElement).not.toBe(null)
  })
})
