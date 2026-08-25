import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  isContentVisible,
  mountVariant,
  openVariant,
  queryTestId,
  stubElementBox,
  swipe,
} from '@/test/helpers'

import SwipeBannerDefault from './SwipeBannerDefault.vue'

function queryBanner(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.vfm-swipe-banner-container')
}

describe('swipe/swipe-banner-default', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('renders the banner container inside the content', async () => {
    const { wrapper } = mountVariant(SwipeBannerDefault)

    await openVariant(wrapper)

    expect(queryBanner()).not.toBeNull()
  })

  it('renders the two default edge strips', async () => {
    const { wrapper } = mountVariant(SwipeBannerDefault)

    await openVariant(wrapper)

    expect(document.querySelector('.vfm-swipe-banner-back')).not.toBeNull()
    expect(document.querySelector('.vfm-swipe-banner-forward')).not.toBeNull()
  })

  it('does not render a custom banner', async () => {
    const { wrapper } = mountVariant(SwipeBannerDefault)

    await openVariant(wrapper)

    expect(queryTestId('custom-banner')).toBeNull()
  })

  it('closes when the banner itself is dragged', async () => {
    const { wrapper } = mountVariant(SwipeBannerDefault)
    await openVariant(wrapper)

    await swipe('right', { target: queryBanner() })

    expect(isContentVisible()).toBe(false)
  })

  it('ignores drags on the content once the banner owns the gesture', async () => {
    const { wrapper } = mountVariant(SwipeBannerDefault)
    await openVariant(wrapper)

    await swipe('right')

    expect(isContentVisible()).toBe(true)
  })
})
