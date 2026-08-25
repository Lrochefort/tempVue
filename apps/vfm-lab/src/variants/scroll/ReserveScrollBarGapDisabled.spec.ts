import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant } from '@/test/helpers'

import ReserveScrollBarGapDisabled from './ReserveScrollBarGapDisabled.vue'

describe('scroll/reserve-scroll-bar-gap-disabled', () => {
  it('does not add compensating padding', async () => {
    const { wrapper } = mountVariant(ReserveScrollBarGapDisabled)

    await openVariant(wrapper)

    expect(document.body.style.paddingRight).toBe('')
  })

  it('still locks the scroll', async () => {
    const { wrapper } = mountVariant(ReserveScrollBarGapDisabled)

    await openVariant(wrapper)

    expect(document.body.style.overflow).toBe('hidden')
  })
})
