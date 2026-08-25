import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryContent, queryTestId } from '@/test/helpers'

import UseModalPatchOptions from './UseModalPatchOptions.vue'

describe('composition/use-modal-patch-options', () => {
  it('starts with the original attrs and slots', async () => {
    const { wrapper } = mountVariant(UseModalPatchOptions)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('lab-patch--before')).toBe(true)
    expect(queryTestId('dynamic-content')?.textContent).toBe('Before patching')
  })

  it('replaces the slot content when patched while open', async () => {
    const { wrapper } = mountVariant(UseModalPatchOptions)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="patch"]').trigger('click')
    await flushModal()

    expect(queryTestId('dynamic-content')?.textContent).toBe('After patching')
  })

  it('merges patched attrs rather than replacing the whole set', async () => {
    const { wrapper } = mountVariant(UseModalPatchOptions)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="patch"]').trigger('click')
    await flushModal()

    expect(queryContent()?.classList.contains('lab-patch--after')).toBe(true)
  })
})
