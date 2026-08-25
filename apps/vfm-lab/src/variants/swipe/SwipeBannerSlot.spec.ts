import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryTestId } from '@/test/helpers'

import SwipeBannerSlot from './SwipeBannerSlot.vue'

describe('swipe/swipe-banner-slot', () => {
  it('renders the slot content inside the banner container', async () => {
    const { wrapper } = mountVariant(SwipeBannerSlot)

    await openVariant(wrapper)

    const banner = queryTestId('custom-banner')
    expect(banner).not.toBeNull()
    expect(banner?.parentElement?.classList.contains('vfm-swipe-banner-container')).toBe(true)
  })

  it('replaces the default edge strips', async () => {
    const { wrapper } = mountVariant(SwipeBannerSlot)

    await openVariant(wrapper)

    expect(document.querySelector('.vfm-swipe-banner-back')).toBeNull()
    expect(document.querySelector('.vfm-swipe-banner-forward')).toBeNull()
  })
})
