import { describe, expect, it } from 'vitest'

import {
  beginClose,
  beginOpen,
  flushModal,
  mountVariant,
  openVariant,
  queryContent,
  queryOverlay,
} from '@/test/helpers'

import TransitionFade from './TransitionFade.vue'

describe('transitions/transition-fade', () => {
  it('applies the enter classes on the content while opening', async () => {
    const { wrapper } = mountVariant(TransitionFade)

    await beginOpen(wrapper)

    const classes = queryContent()?.classList
    expect(classes?.contains('vfm-fade-enter-from')).toBe(true)
    expect(classes?.contains('vfm-fade-enter-active')).toBe(true)
  })

  it('applies the enter classes on the overlay too', async () => {
    const { wrapper } = mountVariant(TransitionFade)

    await beginOpen(wrapper)

    expect(queryOverlay()?.classList.contains('vfm-fade-enter-active')).toBe(true)
  })

  it('removes the enter classes once the transition finishes', async () => {
    const { wrapper } = mountVariant(TransitionFade)

    await openVariant(wrapper)

    expect(queryContent()?.className).toBe('vfm__content vfm--outline-none')
  })

  it('applies the leave classes while closing', async () => {
    const { wrapper } = mountVariant(TransitionFade)
    await openVariant(wrapper)

    await beginClose()

    expect(queryContent()?.classList.contains('vfm-fade-leave-active')).toBe(true)
  })

  it('removes the modal from the DOM after the leave transition', async () => {
    const { wrapper } = mountVariant(TransitionFade)
    await openVariant(wrapper)

    await beginClose()
    await flushModal()

    expect(queryContent()).toBeNull()
  })
})
