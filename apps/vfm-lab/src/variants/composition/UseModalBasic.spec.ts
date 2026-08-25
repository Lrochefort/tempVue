import { describe, expect, it } from 'vitest'

import {
  clickTeleported,
  flushModal,
  mountVariant,
  openVariant,
  queryContent,
  queryTestId,
} from '@/test/helpers'

import UseModalBasic from './UseModalBasic.vue'

describe('composition/use-modal-basic', () => {
  it('renders nothing until the modal is opened', () => {
    mountVariant(UseModalBasic)

    expect(queryContent()).toBeNull()
  })

  it('mounts the dynamic modal into the container on open', async () => {
    const { wrapper } = mountVariant(UseModalBasic)

    await openVariant(wrapper)

    expect(queryContent()).not.toBeNull()
  })

  it('renders a string slot as raw markup', async () => {
    const { wrapper } = mountVariant(UseModalBasic)

    await openVariant(wrapper)

    expect(queryTestId('dynamic-content')?.textContent).toBe('Created entirely from script')
  })

  it('registers the modal on the vfm instance', async () => {
    const { wrapper, vfm } = mountVariant(UseModalBasic)

    await openVariant(wrapper)

    expect(vfm.dynamicModals).toHaveLength(1)
  })

  it('discards the entry again once closed', async () => {
    const { wrapper, vfm } = mountVariant(UseModalBasic)
    await openVariant(wrapper)

    await clickTeleported('close')
    await flushModal()

    expect(queryContent()).toBeNull()
    expect(vfm.dynamicModals).toHaveLength(0)
  })
})
