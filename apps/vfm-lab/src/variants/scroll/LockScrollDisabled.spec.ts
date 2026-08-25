import { describe, expect, it } from 'vitest'

import { isContentVisible, mountVariant, openVariant } from '@/test/helpers'

import LockScrollDisabled from './LockScrollDisabled.vue'

describe('scroll/lock-scroll-disabled', () => {
  it('never touches the body styles', async () => {
    const { wrapper } = mountVariant(LockScrollDisabled)

    await openVariant(wrapper)

    expect(document.body.style.cssText).toBe('')
  })

  it('still opens normally', async () => {
    const { wrapper } = mountVariant(LockScrollDisabled)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })
})
