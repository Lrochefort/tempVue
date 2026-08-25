import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryTestId } from '@/test/helpers'

import UseModalSlots from './UseModalSlots.vue'

describe('composition/use-modal-slots', () => {
  it('renders the slot component', async () => {
    const { wrapper } = mountVariant(UseModalSlots)

    await openVariant(wrapper)

    expect(queryTestId('content')).not.toBeNull()
  })

  it('passes the slot attrs down as props', async () => {
    const { wrapper } = mountVariant(UseModalSlots)

    await openVariant(wrapper)

    expect(queryTestId('content-heading')?.textContent).toBe('Rendered through useModalSlot')
  })
})
