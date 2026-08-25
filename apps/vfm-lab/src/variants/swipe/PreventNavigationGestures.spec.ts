import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  isContentVisible,
  mountVariant,
  openVariant,
  queryTestId,
  stubElementBox,
  swipe,
} from '@/test/helpers'

import PreventNavigationGestures from './PreventNavigationGestures.vue'

describe('swipe/prevent-navigation-gestures', () => {
  let restoreBox: () => void

  beforeEach(() => {
    restoreBox = stubElementBox()
  })

  afterEach(() => {
    restoreBox()
  })

  it('renders the edge container even without showSwipeBanner', async () => {
    const { wrapper } = mountVariant(PreventNavigationGestures)

    await openVariant(wrapper)

    expect(document.querySelector('.vfm-swipe-banner-container')).not.toBeNull()
  })

  it('keeps the default edge strips', async () => {
    const { wrapper } = mountVariant(PreventNavigationGestures)

    await openVariant(wrapper)

    expect(document.querySelector('.vfm-swipe-banner-back')).not.toBeNull()
  })

  it('does not expose a custom banner slot', async () => {
    const { wrapper } = mountVariant(PreventNavigationGestures)

    await openVariant(wrapper)

    expect(queryTestId('custom-banner')).toBeNull()
  })

  it('leaves the swipe gesture on the content', async () => {
    const { wrapper } = mountVariant(PreventNavigationGestures)
    await openVariant(wrapper)

    await swipe('right')

    expect(isContentVisible()).toBe(false)
  })
})
