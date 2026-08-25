import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent, queryOverlay } from '@/test/helpers'

import OverlayCustomAppearance from './OverlayCustomAppearance.vue'

describe('overlay/overlay-custom-appearance', () => {
  it('merges overlayClass with the library classes', async () => {
    const { wrapper } = mountVariant(OverlayCustomAppearance)

    await openVariant(wrapper)

    const overlay = queryOverlay()
    expect(overlay?.classList.contains('lab-overlay')).toBe(true)
    expect(overlay?.classList.contains('lab-overlay--tinted')).toBe(true)
    expect(overlay?.classList.contains('vfm__overlay')).toBe(true)
  })

  it('applies overlayStyle as inline styles', async () => {
    const { wrapper } = mountVariant(OverlayCustomAppearance)

    await openVariant(wrapper)

    const overlay = queryOverlay()
    expect(overlay?.style.backgroundColor).toBe('rgb(10, 20, 30)')
    expect(overlay?.style.opacity).toBe('0.8')
  })

  it('does not leak overlay styling onto the content element', async () => {
    const { wrapper } = mountVariant(OverlayCustomAppearance)

    await openVariant(wrapper)

    const content = queryContent()
    expect(content?.classList.contains('lab-overlay')).toBe(false)
    expect(content?.style.backgroundColor).toBe('')
  })
})
