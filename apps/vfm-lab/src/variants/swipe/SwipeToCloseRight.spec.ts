import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { isContentVisible, mountVariant, openVariant, stubElementBox, swipe } from '@/test/helpers'

import SwipeToCloseRight from './SwipeToCloseRight.vue'

describe('swipe/swipe-to-close-right', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('closes when dragged to the right', async () => {
    const { wrapper } = mountVariant(SwipeToCloseRight)
    await openVariant(wrapper)

    await swipe('right')

    expect(isContentVisible()).toBe(false)
  })

  it('stays open when dragged to the left', async () => {
    const { wrapper } = mountVariant(SwipeToCloseRight)
    await openVariant(wrapper)

    await swipe('left')

    expect(isContentVisible()).toBe(true)
  })
})
