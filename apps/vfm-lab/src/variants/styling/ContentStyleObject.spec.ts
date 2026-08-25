import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent, queryOverlay } from '@/test/helpers'

import ContentStyleObject from './ContentStyleObject.vue'

describe('styling/content-style-object', () => {
  it('applies the style object inline', async () => {
    const { wrapper } = mountVariant(ContentStyleObject)

    await openVariant(wrapper)

    const content = queryContent()
    expect(content?.style.padding).toBe('2rem')
    expect(content?.style.backgroundColor).toBe('rgb(240, 240, 240)')
  })

  it('does not leak content styling onto the overlay', async () => {
    const { wrapper } = mountVariant(ContentStyleObject)

    await openVariant(wrapper)

    expect(queryOverlay()?.style.padding).toBe('')
  })
})
