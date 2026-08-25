import { describe, expect, it } from 'vitest'

import {
  clickTeleported,
  isContentVisible,
  mountVariant,
  openVariant,
  queryContent,
} from '@/test/helpers'

import UseVfmAttrsBridge from './UseVfmAttrsBridge.vue'

describe('composition/use-vfm-attrs-bridge', () => {
  it('forwards v-model through the wrapper', async () => {
    const { wrapper } = mountVariant(UseVfmAttrsBridge)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })

  it('forwards modal props picked out of the wrapper props', async () => {
    const { wrapper } = mountVariant(UseVfmAttrsBridge)

    await openVariant(wrapper)

    expect(queryContent()?.classList.contains('lab-bridged')).toBe(true)
  })

  it('re-emits the wrapper\u2019s own events', async () => {
    const { wrapper } = mountVariant(UseVfmAttrsBridge)
    await openVariant(wrapper)

    await clickTeleported('confirm')

    expect(wrapper.get('[data-testid="confirmed"]').text()).toBe('true')
  })

  it('re-emits the modal lifecycle events', async () => {
    const { wrapper } = mountVariant(UseVfmAttrsBridge)
    await openVariant(wrapper)

    await clickTeleported('content-close')

    expect(wrapper.get('[data-testid="closed-count"]').text()).toBe('1')
  })
})
