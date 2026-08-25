import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryContent, queryRoot } from '@/test/helpers'

import BackgroundNonInteractive from './BackgroundNonInteractive.vue'

describe('focus/background-non-interactive', () => {
  it('keeps pointer events on the modal root', async () => {
    const { wrapper } = mountVariant(BackgroundNonInteractive)

    await openVariant(wrapper)

    expect(queryRoot()?.classList.contains('vfm--prevent-none')).toBe(false)
  })

  it('does not add the pointer-events escape hatch to the content', async () => {
    const { wrapper } = mountVariant(BackgroundNonInteractive)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('vfm--prevent-auto')).toBe(false)
  })
})
