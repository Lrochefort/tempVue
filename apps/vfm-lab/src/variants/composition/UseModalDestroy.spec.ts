import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryContent } from '@/test/helpers'

import UseModalDestroy from './UseModalDestroy.vue'

describe('composition/use-modal-destroy', () => {
  it('registers the modal when opened', async () => {
    const { wrapper, vfm } = mountVariant(UseModalDestroy)

    await openVariant(wrapper)

    expect(vfm.dynamicModals).toHaveLength(1)
  })

  it('removes the modal from the DOM immediately', async () => {
    const { wrapper } = mountVariant(UseModalDestroy)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="destroy"]').trigger('click')
    await flushModal()

    expect(queryContent()).toBeNull()
  })

  it('deregisters the modal from the vfm instance', async () => {
    const { wrapper, vfm } = mountVariant(UseModalDestroy)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="destroy"]').trigger('click')
    await flushModal()

    expect(vfm.dynamicModals).toHaveLength(0)
    expect(wrapper.get('[data-testid="registered-count"]').text()).toBe('0')
  })
})
