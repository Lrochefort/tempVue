import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, pressEscape, queryRoot } from '@/test/helpers'

import EscToCloseDisabled from './EscToCloseDisabled.vue'

describe('closing/esc-to-close-disabled', () => {
  it('ignores Escape', async () => {
    const { wrapper } = mountVariant(EscToCloseDisabled)
    await openVariant(wrapper)

    await pressEscape()

    expect(queryRoot()).not.toBeNull()
  })
})
