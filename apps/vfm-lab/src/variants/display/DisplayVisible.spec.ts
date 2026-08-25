import { describe, expect, it } from 'vitest'

import { closeFromContent, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import DisplayVisible from './DisplayVisible.vue'

describe('display/display-visible', () => {
  it('keeps the modal mounted while closed, hidden with visibility:hidden', () => {
    mountVariant(DisplayVisible)

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(root?.style.visibility).toBe('hidden')
  })

  it('preserves the layout box rather than removing it from flow', () => {
    mountVariant(DisplayVisible)

    // The distinguishing trait versus `show`: display is untouched.
    expect(queryRoot()?.style.display).not.toBe('none')
  })

  it('clears visibility:hidden when opened', async () => {
    const { wrapper } = mountVariant(DisplayVisible)

    await openVariant(wrapper)

    expect(queryRoot()?.style.visibility).not.toBe('hidden')
  })

  it('restores visibility:hidden on close without unmounting', async () => {
    const { wrapper } = mountVariant(DisplayVisible)
    await openVariant(wrapper)

    await closeFromContent()

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(root?.style.visibility).toBe('hidden')
  })
})
