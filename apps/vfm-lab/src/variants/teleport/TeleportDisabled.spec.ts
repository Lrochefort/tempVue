import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryRoot } from '@/test/helpers'

import TeleportDisabled from './TeleportDisabled.vue'

describe('teleport/teleport-disabled', () => {
  it('renders the modal inline inside the component tree', async () => {
    const { wrapper, container } = mountVariant(TeleportDisabled)

    await openVariant(wrapper)

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(container.contains(root)).toBe(true)
  })

  it('does not attach the modal to document.body', async () => {
    const { wrapper } = mountVariant(TeleportDisabled)

    await openVariant(wrapper)

    expect(queryRoot()?.parentElement).not.toBe(document.body)
  })
})
