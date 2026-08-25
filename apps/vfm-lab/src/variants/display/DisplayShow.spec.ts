import { describe, expect, it } from 'vitest'

import { closeFromContent, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import DisplayShow from './DisplayShow.vue'

describe('display/display-show', () => {
  it('keeps the modal mounted while closed, hidden with display:none', () => {
    mountVariant(DisplayShow)

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(root?.style.display).toBe('none')
  })

  it('clears display:none when opened', async () => {
    const { wrapper } = mountVariant(DisplayShow)

    await openVariant(wrapper)

    expect(queryRoot()?.style.display).not.toBe('none')
  })

  it('restores display:none on close without unmounting', async () => {
    const { wrapper } = mountVariant(DisplayShow)
    await openVariant(wrapper)

    await closeFromContent()

    const root = queryRoot()
    expect(root).not.toBeNull()
    expect(root?.style.display).toBe('none')
  })
})
