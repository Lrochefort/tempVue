import { describe, expect, it } from 'vitest'

import { isContentVisible, mountVariant, openVariant, queryContent } from '@/test/helpers'

import FocusTrapDisabled from './FocusTrapDisabled.vue'

describe('focus/focus-trap-disabled', () => {
  it('opens without activating a trap', async () => {
    const { wrapper } = mountVariant(FocusTrapDisabled)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })

  it('leaves focus where it was', async () => {
    const { wrapper } = mountVariant(FocusTrapDisabled)

    await openVariant(wrapper)

    expect(document.activeElement).not.toBe(queryContent())
  })

  it('lets focus move to an element outside the modal', async () => {
    const { wrapper } = mountVariant(FocusTrapDisabled)
    await openVariant(wrapper)

    const outside = wrapper.get<HTMLButtonElement>('[data-testid="outside-target"]').element
    outside.focus()

    expect(document.activeElement).toBe(outside)
  })
})
