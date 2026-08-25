import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryRoot } from '@/test/helpers'

import TeleportDefault from './TeleportDefault.vue'

describe('teleport/teleport-default', () => {
  // The `teleportTo` prop defaults to "body", so the out-of-the-box behaviour is
  // to teleport, not to render in place.
  it('teleports to document.body by default', async () => {
    const { wrapper, container } = mountVariant(TeleportDefault)

    await openVariant(wrapper)

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(root?.parentElement).toBe(document.body)
    expect(container.contains(root)).toBe(false)
  })
})
