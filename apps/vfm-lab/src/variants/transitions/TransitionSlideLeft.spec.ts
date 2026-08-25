import { describe, expect, it } from 'vitest'

import { beginOpen, mountVariant, queryContent } from '@/test/helpers'

import TransitionSlideLeft from './TransitionSlideLeft.vue'

describe('transitions/transition-slide-left', () => {
  it('uses the vfm-slide-left preset', async () => {
    const { wrapper } = mountVariant(TransitionSlideLeft)

    await beginOpen(wrapper)

    expect(queryContent()?.classList.contains('vfm-slide-left-enter-active')).toBe(true)
  })
})
