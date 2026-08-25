import { describe, expect, it } from 'vitest'

import { closeFromContent, flushModal, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import ControlledModel from './ControlledModel.vue'

describe('display/controlled-model', () => {
  it('starts closed and reports its state', () => {
    const { wrapper } = mountVariant(ControlledModel)

    expect(wrapper.get('[data-testid="state"]').text()).toBe('closed')
    expect(queryRoot()).toBeNull()
  })

  it('opens when the parent sets the bound value', async () => {
    const { wrapper } = mountVariant(ControlledModel)

    await openVariant(wrapper)

    expect(wrapper.get('[data-testid="state"]').text()).toBe('open')
    expect(queryRoot()).not.toBeNull()
  })

  it('closes when the parent clears the bound value', async () => {
    const { wrapper } = mountVariant(ControlledModel)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="external-close"]').trigger('click')
    await flushModal()

    expect(wrapper.get('[data-testid="state"]').text()).toBe('closed')
    expect(queryRoot()).toBeNull()
  })

  it('propagates closes initiated inside the modal back to the parent', async () => {
    const { wrapper } = mountVariant(ControlledModel)
    await openVariant(wrapper)

    await closeFromContent()

    expect(wrapper.get('[data-testid="state"]').text()).toBe('closed')
  })
})
