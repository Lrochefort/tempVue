import { describe, expect, it } from 'vitest'

import { isContentVisible, mountVariant, openVariant, queryContent } from '@/test/helpers'

import FocusTrapOptions from './FocusTrapOptions.vue'

// The variant sets `focusTrap` itself, so it wins over the harness default.
// `tabbableOptions.displayCheck: 'none'` is what lets the trap activate under
// jsdom without any DOM shimming.
describe('focus/focus-trap-options', () => {
  it('activates the trap with the supplied options', async () => {
    const { wrapper } = mountVariant(FocusTrapOptions)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })

  it('focuses the modal content on open', async () => {
    const { wrapper } = mountVariant(FocusTrapOptions)

    await openVariant(wrapper)

    expect(document.activeElement).toBe(queryContent())
  })
})
