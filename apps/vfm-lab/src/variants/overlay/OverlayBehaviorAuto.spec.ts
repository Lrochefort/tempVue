import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryAllOverlays } from '@/test/helpers'

import OverlayBehaviorAuto from './OverlayBehaviorAuto.vue'

describe('overlay/overlay-behavior-auto', () => {
  it('shows the overlay for a single open modal', async () => {
    const { wrapper } = mountVariant(OverlayBehaviorAuto)

    await openVariant(wrapper)

    expect(queryAllOverlays()).toHaveLength(1)
  })

  // With the default `displayDirective: 'if'`, an overlay that `auto` decides to
  // hide is removed from the DOM rather than merely set to `display: none`.
  it('drops the lower overlay when a second modal is stacked on top', async () => {
    const { wrapper } = mountVariant(OverlayBehaviorAuto)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()

    expect(queryAllOverlays()).toHaveLength(1)
  })

  it('restores the lower overlay once the top modal closes', async () => {
    const { wrapper } = mountVariant(OverlayBehaviorAuto)
    await openVariant(wrapper)
    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()

    await wrapper.get('[data-testid="close-second"]').trigger('click')
    await flushModal()

    expect(queryAllOverlays()).toHaveLength(1)
  })
})
