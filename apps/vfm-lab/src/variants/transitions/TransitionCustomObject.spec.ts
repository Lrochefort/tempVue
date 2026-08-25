import { describe, expect, it } from 'vitest'

import { beginClose, beginOpen, mountVariant, openVariant, queryContent } from '@/test/helpers'

import TransitionCustomObject from './TransitionCustomObject.vue'

describe('transitions/transition-custom-object', () => {
  it('honours the explicit enter class names', async () => {
    const { wrapper } = mountVariant(TransitionCustomObject)

    await beginOpen(wrapper)

    const classes = queryContent()?.classList
    expect(classes?.contains('lab-zoom--from')).toBe(true)
    expect(classes?.contains('lab-zoom--entering')).toBe(true)
  })

  it('does not derive enter classes from the transition name', async () => {
    const { wrapper } = mountVariant(TransitionCustomObject)

    await beginOpen(wrapper)

    expect(queryContent()?.classList.contains('lab-zoom-enter-active')).toBe(false)
  })

  it('falls back to name-derived classes for the hooks left unspecified', async () => {
    const { wrapper } = mountVariant(TransitionCustomObject)
    await openVariant(wrapper)

    await beginClose()

    const classes = queryContent()?.classList
    expect(classes?.contains('lab-zoom-leave-from')).toBe(true)
    expect(classes?.contains('lab-zoom-leave-active')).toBe(true)
  })
})
