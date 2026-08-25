import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryOverlay } from '@/test/helpers'

import OverlayDefault from './OverlayDefault.vue'

describe('overlay/overlay-default', () => {
  it('renders an overlay element alongside the content', async () => {
    const { wrapper } = mountVariant(OverlayDefault)

    await openVariant(wrapper)

    expect(queryOverlay()).not.toBeNull()
  })

  it('applies the library overlay classes', async () => {
    const { wrapper } = mountVariant(OverlayDefault)

    await openVariant(wrapper)

    const overlay = queryOverlay()
    expect(overlay?.classList.contains('vfm__overlay')).toBe(true)
    expect(overlay?.classList.contains('vfm--overlay')).toBe(true)
    expect(overlay?.classList.contains('vfm--absolute')).toBe(true)
    expect(overlay?.classList.contains('vfm--inset')).toBe(true)
  })

  it('hides the overlay from assistive technology', async () => {
    const { wrapper } = mountVariant(OverlayDefault)

    await openVariant(wrapper)

    expect(queryOverlay()?.getAttribute('aria-hidden')).toBe('true')
  })
})
