import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryRoot } from '@/test/helpers'

import TeleportToBody from './TeleportToBody.vue'

describe('teleport/teleport-to-body', () => {
  it('moves the modal to document.body', async () => {
    const { wrapper } = mountVariant(TeleportToBody)

    await openVariant(wrapper)

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(root?.parentElement).toBe(document.body)
  })

  it('moves the modal out of the component tree', async () => {
    const { wrapper, container } = mountVariant(TeleportToBody)

    await openVariant(wrapper)

    expect(container.contains(queryRoot())).toBe(false)
  })
})
