import { describe, expect, it } from 'vitest'

import { beginOpen, mountVariant, openVariant, queryContent } from '@/test/helpers'

import TransitionSlideUp from './TransitionSlideUp.vue'

describe('transitions/transition-slide-up', () => {
  it('uses the vfm-slide-up preset on the content', async () => {
    const { wrapper } = mountVariant(TransitionSlideUp)

    await beginOpen(wrapper)

    expect(queryContent()?.classList.contains('vfm-slide-up-enter-active')).toBe(true)
  })

  it('leaves the overlay on its default transition', async () => {
    const { wrapper } = mountVariant(TransitionSlideUp)

    await beginOpen(wrapper)

    expect(queryContent()?.classList.contains('vfm-fade-enter-active')).toBe(false)
  })

  it('settles into the plain content classes', async () => {
    const { wrapper } = mountVariant(TransitionSlideUp)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('vfm-slide-up-enter-active')).toBe(false)
  })
})
