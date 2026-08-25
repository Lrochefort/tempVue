import { describe, expect, it } from 'vitest'

import { flushModal, mountVariant, openVariant, queryContent } from '@/test/helpers'

import ContentClassReactive from './ContentClassReactive.vue'

describe('styling/content-class-reactive', () => {
  it('resolves array and object class syntax', async () => {
    const { wrapper } = mountVariant(ContentClassReactive)

    await openVariant(wrapper)

    const content = queryContent()
    expect(content?.classList.contains('lab-content')).toBe(true)
    expect(content?.classList.contains('lab-content--highlighted')).toBe(true)
  })

  it('updates the class list when the bound condition changes', async () => {
    const { wrapper } = mountVariant(ContentClassReactive)
    await openVariant(wrapper)

    await wrapper.get('[data-testid="toggle-highlight"]').trigger('click')
    await flushModal()

    const content = queryContent()
    expect(content?.classList.contains('lab-content')).toBe(true)
    expect(content?.classList.contains('lab-content--highlighted')).toBe(false)
  })
})
