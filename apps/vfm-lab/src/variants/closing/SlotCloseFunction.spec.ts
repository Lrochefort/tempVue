import { describe, expect, it } from 'vitest'

import { clickTeleported, mountVariant, openVariant, queryRoot, queryTestId } from '@/test/helpers'

import SlotCloseFunction from './SlotCloseFunction.vue'

describe('closing/slot-close-function', () => {
  it('exposes a close function to the default slot', async () => {
    const { wrapper } = mountVariant(SlotCloseFunction)

    await openVariant(wrapper)

    expect(queryTestId('slot-close')).not.toBeNull()
  })

  it('closes the modal when the slot close function is called', async () => {
    const { wrapper } = mountVariant(SlotCloseFunction)
    await openVariant(wrapper)

    await clickTeleported('slot-close')

    expect(queryRoot()).toBeNull()
  })
})
