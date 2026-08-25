import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, pressEscape, queryRoot } from '@/test/helpers'

import EscToCloseEnabled from './EscToCloseEnabled.vue'

describe('closing/esc-to-close-enabled', () => {
  it('closes when Escape is pressed', async () => {
    const { wrapper } = mountVariant(EscToCloseEnabled)
    await openVariant(wrapper)

    await pressEscape()

    expect(queryRoot()).toBeNull()
  })
})
