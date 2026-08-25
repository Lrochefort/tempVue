import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryRoot } from '@/test/helpers'

import ZIndexCustom from './ZIndexCustom.vue'

describe('zindex/z-index-custom', () => {
  it('uses the supplied zIndexFn instead of the default', async () => {
    const { wrapper } = mountVariant(ZIndexCustom)

    await openVariant(wrapper)

    expect(queryRoot()?.style.zIndex).toBe('5000')
  })
})
