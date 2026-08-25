import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent, queryOverlay } from '@/test/helpers'

import OverlayHidden from './OverlayHidden.vue'

describe('overlay/overlay-hidden', () => {
  it('renders no overlay element', async () => {
    const { wrapper } = mountVariant(OverlayHidden)

    await openVariant(wrapper)

    expect(queryOverlay()).toBeNull()
  })

  it('still renders the modal content', async () => {
    const { wrapper } = mountVariant(OverlayHidden)

    await openVariant(wrapper)

    expect(queryContent()).not.toBeNull()
  })
})
