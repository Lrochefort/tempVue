import { describe, expect, it } from 'vitest'

import { closeFromContent, flushModal, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import VetoLifecycle from './VetoLifecycle.vue'

describe('closing/veto-lifecycle', () => {
  it('opens normally when nothing vetoes it', async () => {
    const { wrapper } = mountVariant(VetoLifecycle)

    await openVariant(wrapper)

    expect(queryRoot()).not.toBeNull()
  })

  it('cancels opening when beforeOpen calls stop()', async () => {
    const { wrapper } = mountVariant(VetoLifecycle)
    await wrapper.get('[data-testid="block-open"]').trigger('click')

    await openVariant(wrapper)

    expect(queryRoot()).toBeNull()
  })

  it('does not register a vetoed modal as opened', async () => {
    const { wrapper, vfm } = mountVariant(VetoLifecycle)
    await wrapper.get('[data-testid="block-open"]').trigger('click')

    await openVariant(wrapper)

    expect(vfm.openedModals).toHaveLength(0)
  })

  it('cancels closing when beforeClose calls stop()', async () => {
    const { wrapper } = mountVariant(VetoLifecycle)
    await openVariant(wrapper)
    await wrapper.get('[data-testid="block-close"]').trigger('click')

    await closeFromContent()

    expect(queryRoot()).not.toBeNull()
  })

  it('closes once the veto is lifted', async () => {
    const { wrapper } = mountVariant(VetoLifecycle)
    await openVariant(wrapper)
    await wrapper.get('[data-testid="block-close"]').trigger('click')
    await closeFromContent()

    await wrapper.get('[data-testid="block-close"]').trigger('click')
    await flushModal()
    await closeFromContent()

    expect(queryRoot()).toBeNull()
  })
})
