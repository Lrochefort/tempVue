import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant } from '@/test/helpers'

import ReserveScrollBarGapEnabled from './ReserveScrollBarGapEnabled.vue'

// jsdom reports `documentElement.clientWidth === 0`, so the computed scrollbar gap
// equals the full `window.innerWidth` (1024px). The exact number is a jsdom artifact;
// what matters is that the compensating padding is applied at all.
describe('scroll/reserve-scroll-bar-gap-enabled', () => {
  it('adds compensating padding to the body', async () => {
    const { wrapper } = mountVariant(ReserveScrollBarGapEnabled)

    await openVariant(wrapper)

    expect(document.body.style.paddingRight).toBe('1024px')
  })

  it('locks the scroll as well', async () => {
    const { wrapper } = mountVariant(ReserveScrollBarGapEnabled)

    await openVariant(wrapper)

    expect(document.body.style.overflow).toBe('hidden')
  })
})
