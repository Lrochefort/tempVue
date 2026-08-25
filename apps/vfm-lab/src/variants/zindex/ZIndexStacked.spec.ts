import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryAllRoots } from '@/test/helpers'

import ZIndexStacked from './ZIndexStacked.vue'

describe('zindex/z-index-stacked', () => {
  it('increments the z-index by two for each stacked modal', async () => {
    const { wrapper } = mountVariant(ZIndexStacked)

    await openVariant(wrapper)
    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()
    await wrapper.get('[data-testid="trigger-third"]').trigger('click')
    await flushModal()

    const zIndexes = queryAllRoots().map((root) => root.style.zIndex)
    expect(zIndexes).toEqual(['1000', '1002', '1004'])
  })

  it('leaves room between modals for their overlays', async () => {
    const { wrapper } = mountVariant(ZIndexStacked)

    await openVariant(wrapper)
    await wrapper.get('[data-testid="trigger-second"]').trigger('click')
    await flushModal()

    const [first, second] = queryAllRoots().map((root) => Number(root.style.zIndex))
    expect((second ?? 0) - (first ?? 0)).toBe(2)
  })
})
