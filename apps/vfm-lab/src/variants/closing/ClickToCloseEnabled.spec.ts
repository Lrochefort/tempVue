import { describe, expect, it } from 'vitest'

import { clickOutsideContent, mountVariant, openVariant, queryRoot } from '@/test/helpers'

import ClickToCloseEnabled from './ClickToCloseEnabled.vue'

describe('closing/click-to-close-enabled', () => {
  it('closes when the backdrop is clicked', async () => {
    const { wrapper } = mountVariant(ClickToCloseEnabled)
    await openVariant(wrapper)

    await clickOutsideContent()

    expect(queryRoot()).toBeNull()
  })

  it('stays open when the click lands on the content', async () => {
    const { wrapper } = mountVariant(ClickToCloseEnabled)
    await openVariant(wrapper)

    document
      .querySelector('.vfm__content')
      ?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    expect(queryRoot()).not.toBeNull()
  })
})
