import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  isContentVisible,
  mountVariant,
  openVariant,
  queryContent,
  stubElementBox,
  swipe,
} from '@/test/helpers'

import SwipeToCloseDown from './SwipeToCloseDown.vue'

describe('swipe/swipe-to-close-down', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('binds a vertical transform to the content', async () => {
    const { wrapper } = mountVariant(SwipeToCloseDown)

    await openVariant(wrapper)

    expect(queryContent()?.style.transform).toBe('translateY(0px)')
  })

  it('closes when dragged downwards', async () => {
    const { wrapper } = mountVariant(SwipeToCloseDown)
    await openVariant(wrapper)

    await swipe('down')

    expect(isContentVisible()).toBe(false)
  })

  it('stays open when dragged upwards', async () => {
    const { wrapper } = mountVariant(SwipeToCloseDown)
    await openVariant(wrapper)

    await swipe('up')

    expect(isContentVisible()).toBe(true)
  })
})
