import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent } from '@/test/helpers'

import ContentStyleArray from './ContentStyleArray.vue'

describe('styling/content-style-array', () => {
  it('merges every entry of the style array', async () => {
    const { wrapper } = mountVariant(ContentStyleArray)

    await openVariant(wrapper)

    const content = queryContent()
    expect(content?.style.padding).toBe('1rem')
    expect(content?.style.border).toBe('2px solid rgb(0, 0, 255)')
  })
})
