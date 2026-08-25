import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  isContentVisible,
  mountVariant,
  openVariant,
  queryContent,
  stubElementBox,
  swipe,
} from '@/test/helpers'

import SwipeToCloseLeft from './SwipeToCloseLeft.vue'

describe('swipe/swipe-to-close-left', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('binds a horizontal transform to the content', async () => {
    const { wrapper } = mountVariant(SwipeToCloseLeft)

    await openVariant(wrapper)

    expect(queryContent()?.style.transform).toBe('translateX(0px)')
  })

  it('closes when dragged to the left', async () => {
    const { wrapper } = mountVariant(SwipeToCloseLeft)
    await openVariant(wrapper)

    await swipe('left')

    expect(isContentVisible()).toBe(false)
  })

  it('stays open when dragged to the right', async () => {
    const { wrapper } = mountVariant(SwipeToCloseLeft)
    await openVariant(wrapper)

    await swipe('right')

    expect(isContentVisible()).toBe(true)
  })
})
