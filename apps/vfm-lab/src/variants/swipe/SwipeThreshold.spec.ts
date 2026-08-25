import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { isContentVisible, mountVariant, openVariant, stubElementBox, swipe } from '@/test/helpers'

import SwipeThreshold from './SwipeThreshold.vue'

describe('swipe/swipe-threshold', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('ignores a drag shorter than the threshold', async () => {
    const { wrapper } = mountVariant(SwipeThreshold)
    await openVariant(wrapper)

    await swipe('down', { distance: 50 })

    expect(isContentVisible()).toBe(true)
  })

  it('closes on a drag past the threshold', async () => {
    const { wrapper } = mountVariant(SwipeThreshold)
    await openVariant(wrapper)

    await swipe('down', { distance: 200 })

    expect(isContentVisible()).toBe(false)
  })
})
