import { getModalExposed } from '@lrochefort/vue-final-modal'
import { describe, expect, it } from 'vitest'

import { flushModal, isContentVisible, mountVariant, openVariant } from '@/test/helpers'

import GetModalExposed from './GetModalExposed.vue'

describe('composition/get-modal-exposed', () => {
  it('exposes the modal even while it is closed', async () => {
    const { wrapper } = mountVariant(GetModalExposed)

    await wrapper.get('[data-testid="inspect"]').trigger('click')

    expect(wrapper.get('[data-testid="report"]').text()).toBe('lab-exposed:persist:false')
  })

  it('has nothing to expose for an unknown modal id', () => {
    const { vfm } = mountVariant(GetModalExposed)

    expect(getModalExposed(vfm.get('does-not-exist'))).toBeUndefined()
  })

  it('exposes the modal id, overlay behavior and overlay visibility', async () => {
    const { wrapper } = mountVariant(GetModalExposed)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="inspect"]').trigger('click')

    expect(wrapper.get('[data-testid="report"]').text()).toBe('lab-exposed:persist:true')
  })

  it('can drive the modal through the exposed toggle', async () => {
    const { wrapper } = mountVariant(GetModalExposed)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="toggle-exposed"]').trigger('click')
    await flushModal()

    expect(isContentVisible()).toBe(false)
  })
})
