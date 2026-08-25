import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryRoot } from '@/test/helpers'

import TeleportToSelector from './TeleportToSelector.vue'

describe('teleport/teleport-to-selector', () => {
  it('renders the modal inside the targeted element', async () => {
    const { wrapper } = mountVariant(TeleportToSelector)

    await openVariant(wrapper)

    const target = document.querySelector('#vfm-lab-teleport-target')
    const root = queryRoot()
    expect(target).not.toBeNull()
    expect(root).not.toBeNull()
    expect(target?.contains(root ?? null)).toBe(true)
  })

  it('does not attach the modal directly to document.body', async () => {
    const { wrapper } = mountVariant(TeleportToSelector)

    await openVariant(wrapper)

    expect(queryRoot()?.parentElement).not.toBe(document.body)
  })
})
