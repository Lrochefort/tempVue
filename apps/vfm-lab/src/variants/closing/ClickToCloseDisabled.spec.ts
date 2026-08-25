import { describe, expect, it } from 'vitest'

import { clickOutsideContent, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import ClickToCloseDisabled from './ClickToCloseDisabled.vue'

describe('closing/click-to-close-disabled', () => {
  it('stays open when the backdrop is clicked', async () => {
    const { wrapper } = mountVariant(ClickToCloseDisabled)
    await openVariant(wrapper)

    await clickOutsideContent()

    expect(queryRoot()).not.toBeNull()
  })

  // clickOutside is the escape hatch for building custom dismissal rules, and it
  // only fires while clickToClose is disabled.
  it('still reports the backdrop click through clickOutside', async () => {
    const { wrapper } = mountVariant(ClickToCloseDisabled)
    await openVariant(wrapper)

    await clickOutsideContent()

    expect(wrapper.get('[data-testid="outside-clicks"]').text()).toBe('1')
  })

  it('reports every backdrop click', async () => {
    const { wrapper } = mountVariant(ClickToCloseDisabled)
    await openVariant(wrapper)

    await clickOutsideContent()
    await clickOutsideContent()

    expect(wrapper.get('[data-testid="outside-clicks"]').text()).toBe('2')
  })
})
