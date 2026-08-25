import { describe, expect, it } from 'vitest'

import { closeFromContent, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import ZIndexResetOnClose from './ZIndexResetOnClose.vue'

describe('zindex/z-index-reset-on-close', () => {
  it('assigns a z-index while open', async () => {
    const { wrapper } = mountVariant(ZIndexResetOnClose)

    await openVariant(wrapper)

    expect(queryRoot()?.style.zIndex).toBe('1000')
  })

  it('clears the z-index once closed', async () => {
    const { wrapper } = mountVariant(ZIndexResetOnClose)
    await openVariant(wrapper)

    await closeFromContent()

    expect(queryRoot()?.style.zIndex).toBe('')
  })
})
