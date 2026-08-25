import { describe, expect, it } from 'vitest'

import {
  clickTeleported,
  flushModal,
  isContentVisible,
  mountVariant,
  openVariant,
  queryContent,
} from '@/test/helpers'

import UseModalKeepAlive from './UseModalKeepAlive.vue'

describe('composition/use-modal-keep-alive', () => {
  it('opens like any other dynamic modal', async () => {
    const { wrapper } = mountVariant(UseModalKeepAlive)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })

  it('keeps the content mounted after closing', async () => {
    const { wrapper } = mountVariant(UseModalKeepAlive)
    await openVariant(wrapper)

    await clickTeleported('close')
    await flushModal()

    expect(queryContent()).not.toBeNull()
    expect(isContentVisible()).toBe(false)
  })

  it('keeps the entry registered so it can be reopened', async () => {
    const { wrapper, vfm } = mountVariant(UseModalKeepAlive)
    await openVariant(wrapper)
    await clickTeleported('close')
    await flushModal()

    expect(vfm.dynamicModals).toHaveLength(1)

    await openVariant(wrapper)

    expect(isContentVisible()).toBe(true)
  })
})
