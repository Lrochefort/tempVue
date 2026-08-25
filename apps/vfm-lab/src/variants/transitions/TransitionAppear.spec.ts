import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { flushModal, isContentVisible, mountVariant, queryContent } from '@/test/helpers'

import TransitionAppear from './TransitionAppear.vue'

// The library normalises every transition to `appear: true`. Explicit appear
// classes make it possible to tell which phase Vue actually ran: if the content
// were part of the first render we would see `lab-appear--*`, and we do not.
describe('transitions/transition-appear', () => {
  it('opens straight away when the model starts as true', async () => {
    mountVariant(TransitionAppear)

    await flushModal()

    expect(isContentVisible()).toBe(true)
  })

  it('runs the enter phase rather than the appear phase', async () => {
    mountVariant(TransitionAppear)

    await nextTick()
    await nextTick()

    const classes = queryContent()?.classList
    expect(classes?.contains('vfm-fade-enter-active')).toBe(true)
    expect(classes?.contains('lab-appear--active')).toBe(false)
  })

  it('clears the transition classes once settled', async () => {
    mountVariant(TransitionAppear)

    // The content mounts one tick behind the overlay, so its own enter
    // transition needs a second drain to finish.
    await flushModal()
    await flushModal()

    expect(queryContent()?.className).toBe('vfm__content vfm--outline-none')
  })
})
