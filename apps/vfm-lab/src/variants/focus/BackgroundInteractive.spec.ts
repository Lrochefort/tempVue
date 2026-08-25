import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent, queryRoot } from '@/test/helpers'

import BackgroundInteractive from './BackgroundInteractive.vue'

describe('focus/background-interactive', () => {
  it('marks the modal root as pointer-events: none', async () => {
    const { wrapper } = mountVariant(BackgroundInteractive)

    await openVariant(wrapper)

    expect(queryRoot()?.classList.contains('vfm--prevent-none')).toBe(true)
  })

  it('re-enables pointer events on the content itself', async () => {
    const { wrapper } = mountVariant(BackgroundInteractive)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('vfm--prevent-auto')).toBe(true)
  })
})
