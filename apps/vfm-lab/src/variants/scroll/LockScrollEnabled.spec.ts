import { describe, expect, it } from 'vitest'

import { closeFromContent, mountVariant, openVariant } from '@/test/helpers'

import LockScrollEnabled from './LockScrollEnabled.vue'

describe('scroll/lock-scroll-enabled', () => {
  it('leaves the body untouched before the modal opens', () => {
    mountVariant(LockScrollEnabled)

    expect(document.body.style.overflow).toBe('')
  })

  it('hides body overflow while the modal is open', async () => {
    const { wrapper } = mountVariant(LockScrollEnabled)

    await openVariant(wrapper)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores the body styles when the modal closes', async () => {
    const { wrapper } = mountVariant(LockScrollEnabled)
    await openVariant(wrapper)

    await closeFromContent()

    expect(document.body.style.cssText).toBe('')
  })
})
