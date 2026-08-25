import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryAllContents } from '@/test/helpers'

import UseVfmCloseAll from './UseVfmCloseAll.vue'

describe('composition/use-vfm-close-all', () => {
  it('tracks every opened modal', async () => {
    const { wrapper, vfm } = mountVariant(UseVfmCloseAll)

    await openVariant(wrapper)
    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()

    expect(queryAllContents()).toHaveLength(2)
    expect(vfm.openedModals).toHaveLength(2)
  })

  it('closes the whole stack at once', async () => {
    const { wrapper } = mountVariant(UseVfmCloseAll)
    await openVariant(wrapper)
    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()

    await wrapper.get('[data-testid="close-all"]').trigger('click')
    await flushModal()

    expect(queryAllContents()).toHaveLength(0)
  })

  it('resolves even when nothing is open', async () => {
    const { vfm } = mountVariant(UseVfmCloseAll)

    await expect(vfm.closeAll()).resolves.toEqual([])
  })
})
