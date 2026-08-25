import { describe, expect, it } from 'vitest'

import { beginOpen, mountVariant, queryContent } from '@/test/helpers'

import TransitionSlideRight from './TransitionSlideRight.vue'

describe('transitions/transition-slide-right', () => {
  it('uses the vfm-slide-right preset', async () => {
    const { wrapper } = mountVariant(TransitionSlideRight)

    await beginOpen(wrapper)

    expect(queryContent()?.classList.contains('vfm-slide-right-enter-active')).toBe(true)
  })
})
