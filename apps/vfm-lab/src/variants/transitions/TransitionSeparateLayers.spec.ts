import { describe, expect, it } from 'vitest'

import { beginOpen, mountVariant, queryContent, queryOverlay } from '@/test/helpers'

import TransitionSeparateLayers from './TransitionSeparateLayers.vue'

describe('transitions/transition-separate-layers', () => {
  it('animates the overlay with its own preset', async () => {
    const { wrapper } = mountVariant(TransitionSeparateLayers)

    await beginOpen(wrapper)

    expect(queryOverlay()?.classList.contains('vfm-fade-enter-active')).toBe(true)
  })

  it('animates the content with a different preset', async () => {
    const { wrapper } = mountVariant(TransitionSeparateLayers)

    await beginOpen(wrapper)

    const classes = queryContent()?.classList
    expect(classes?.contains('vfm-slide-down-enter-active')).toBe(true)
    expect(classes?.contains('vfm-fade-enter-active')).toBe(false)
  })
})
