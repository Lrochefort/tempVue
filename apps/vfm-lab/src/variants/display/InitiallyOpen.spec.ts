import { describe, expect, it } from 'vitest'

import { closeFromContent, flushModal, mountVariant, queryContent, queryRoot } from '@/test/helpers'

import InitiallyOpen from './InitiallyOpen.vue'

describe('display/initially-open', () => {
  it('renders the modal on mount without any interaction', async () => {
    mountVariant(InitiallyOpen)
    await flushModal()

    expect(queryRoot()).not.toBeNull()
    expect(queryContent()?.textContent).toContain('Rendered open on mount')
  })

  it('registers the open modal with the plugin instance', async () => {
    const { vfm } = mountVariant(InitiallyOpen)
    await flushModal()

    expect(vfm.openedModals).toHaveLength(1)
  })

  it('can still be closed normally', async () => {
    const { vfm } = mountVariant(InitiallyOpen)
    await flushModal()

    await closeFromContent()

    expect(queryRoot()).toBeNull()
    expect(vfm.openedModals).toHaveLength(0)
  })
})
