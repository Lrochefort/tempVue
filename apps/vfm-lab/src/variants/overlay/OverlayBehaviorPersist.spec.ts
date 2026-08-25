import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryAllOverlays } from '@/test/helpers'

import OverlayBehaviorPersist from './OverlayBehaviorPersist.vue'

describe('overlay/overlay-behavior-persist', () => {
  it('shows the overlay for a single open modal', async () => {
    const { wrapper } = mountVariant(OverlayBehaviorPersist)

    await openVariant(wrapper)

    expect(queryAllOverlays()).toHaveLength(1)
  })

  // The distinguishing trait versus `auto`: the lower overlay survives stacking.
  it('keeps every overlay mounted when modals are stacked', async () => {
    const { wrapper } = mountVariant(OverlayBehaviorPersist)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()

    expect(queryAllOverlays()).toHaveLength(2)
  })
})
