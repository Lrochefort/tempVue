import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryRoot } from '@/test/helpers'

import ZIndexDefault from './ZIndexDefault.vue'

describe('zindex/z-index-default', () => {
  it('applies the default 1000 + 2 * index to the first modal', async () => {
    const { wrapper } = mountVariant(ZIndexDefault)

    await openVariant(wrapper)

    expect(queryRoot()?.style.zIndex).toBe('1000')
  })

  it('applies the z-index to the modal root rather than the content', async () => {
    const { wrapper } = mountVariant(ZIndexDefault)

    await openVariant(wrapper)

    expect(document.querySelector<HTMLElement>('.vfm__content')?.style.zIndex).toBe('')
  })
})
