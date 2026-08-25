import { describe, expect, it } from 'vitest'

import { beginClose, beginOpen, mountVariant, openVariant, queryContent } from '@/test/helpers'

import TransitionSlideDown from './TransitionSlideDown.vue'

describe('transitions/transition-slide-down', () => {
  it('uses the vfm-slide-down preset while opening', async () => {
    const { wrapper } = mountVariant(TransitionSlideDown)

    await beginOpen(wrapper)

    expect(queryContent()?.classList.contains('vfm-slide-down-enter-active')).toBe(true)
  })

  it('uses the matching leave class while closing', async () => {
    const { wrapper } = mountVariant(TransitionSlideDown)
    await openVariant(wrapper)

    await beginClose()

    expect(queryContent()?.classList.contains('vfm-slide-down-leave-active')).toBe(true)
  })
})
