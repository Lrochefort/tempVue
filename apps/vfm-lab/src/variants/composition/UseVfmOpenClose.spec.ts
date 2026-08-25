import { describe, expect, it } from 'vitest'

import { flushModal, isContentVisible, mountVariant, openVariant } from '@/test/helpers'

import UseVfmOpenClose from './UseVfmOpenClose.vue'

describe('composition/use-vfm-open-close', () => {
  it('opens the modal addressed by its modalId', async () => {
    const { wrapper } = mountVariant(UseVfmOpenClose)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })

  it('closes the modal addressed by its modalId', async () => {
    const { wrapper } = mountVariant(UseVfmOpenClose)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="close-by-id"]').trigger('click')
    await flushModal()

    expect(isContentVisible()).toBe(false)
  })

  it('registers the modal instance under its id', async () => {
    const { wrapper, vfm } = mountVariant(UseVfmOpenClose)

    await openVariant(wrapper)

    expect(vfm.get('lab-use-vfm')).toBeDefined()
  })

  it('returns undefined for an unknown id', () => {
    const { vfm } = mountVariant(UseVfmOpenClose)

    expect(vfm.open('does-not-exist')).toBeUndefined()
  })
})
