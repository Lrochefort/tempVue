import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  isContentVisible,
  mountVariant,
  openVariant,
  queryContent,
  stubElementBox,
  swipe,
} from '@/test/helpers'

import SwipeToCloseUp from './SwipeToCloseUp.vue'

describe('swipe/swipe-to-close-up', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('binds a vertical transform to the content', async () => {
    const { wrapper } = mountVariant(SwipeToCloseUp)

    await openVariant(wrapper)

    expect(queryContent()?.style.transform).toBe('translateY(0px)')
  })

  it('marks the content as bouncing back while idle', async () => {
    const { wrapper } = mountVariant(SwipeToCloseUp)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('vfm-bounce-back')).toBe(true)
  })

  it('closes when dragged upwards', async () => {
    const { wrapper } = mountVariant(SwipeToCloseUp)
    await openVariant(wrapper)

    await swipe('up')

    expect(isContentVisible()).toBe(false)
  })

  it('stays open when dragged the other way', async () => {
    const { wrapper } = mountVariant(SwipeToCloseUp)
    await openVariant(wrapper)

    await swipe('down')

    expect(isContentVisible()).toBe(true)
  })

  it('stays open when dragged sideways', async () => {
    const { wrapper } = mountVariant(SwipeToCloseUp)
    await openVariant(wrapper)

    await swipe('left')

    expect(isContentVisible()).toBe(true)
  })
})
