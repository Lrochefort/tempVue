import { describe, expect, it } from 'vitest'

import {
  closeFromContent,
  mountVariant,
  openVariant,
  queryContent,
  queryRoot,
} from '@/test/helpers'

import DisplayIf from './DisplayIf.vue'

describe('display/display-if', () => {
  it('renders no modal markup while closed', () => {
    mountVariant(DisplayIf)

    expect(queryRoot()).toBeNull()
    expect(queryContent()).toBeNull()
  })

  it('renders the modal into the DOM when opened', async () => {
    const { wrapper } = mountVariant(DisplayIf)

    await openVariant(wrapper)

    expect(queryRoot()).not.toBeNull()
    expect(queryContent()?.textContent).toContain('nothing is rendered into the DOM')
  })

  it('removes the modal from the DOM again once closed', async () => {
    const { wrapper } = mountVariant(DisplayIf)
    await openVariant(wrapper)
    expect(queryRoot()).not.toBeNull()

    await closeFromContent()

    expect(queryRoot()).toBeNull()
  })
})
