import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent } from '@/test/helpers'

import ContentClassString from './ContentClassString.vue'

describe('styling/content-class-string', () => {
  it('applies every class from the string', async () => {
    const { wrapper } = mountVariant(ContentClassString)

    await openVariant(wrapper)

    const content = queryContent()
    expect(content?.classList.contains('lab-content')).toBe(true)
    expect(content?.classList.contains('lab-content--plain')).toBe(true)
  })

  it('keeps the library content classes', async () => {
    const { wrapper } = mountVariant(ContentClassString)

    await openVariant(wrapper)

    const content = queryContent()
    expect(content?.classList.contains('vfm__content')).toBe(true)
    expect(content?.classList.contains('vfm--outline-none')).toBe(true)
  })
})
