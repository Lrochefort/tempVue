import { describe, expect, it } from 'vitest'

import { isContentVisible, mountVariant, openVariant, queryContent, swipe } from '@/test/helpers'

import SwipeToCloseNone from './SwipeToCloseNone.vue'

describe('swipe/swipe-to-close-none', () => {
  it('does not bind any swipe transform to the content', async () => {
    const { wrapper } = mountVariant(SwipeToCloseNone)

    await openVariant(wrapper)

    expect(queryContent()?.getAttribute('style')).toBeNull()
  })

  it('does not add the bounce-back class', async () => {
    const { wrapper } = mountVariant(SwipeToCloseNone)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('vfm-bounce-back')).toBe(false)
  })

  it('stays open when dragged', async () => {
    const { wrapper } = mountVariant(SwipeToCloseNone)
    await openVariant(wrapper)

    await swipe('down')

    expect(isContentVisible()).toBe(true)
  })
})
