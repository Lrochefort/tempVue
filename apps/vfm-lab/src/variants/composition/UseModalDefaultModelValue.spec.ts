import { describe, expect, it } from 'vitest'

import { flushModal, isContentVisible, mountVariant, queryTestId } from '@/test/helpers'

import UseModalDefaultModelValue from './UseModalDefaultModelValue.vue'

describe('composition/use-modal-default-model-value', () => {
  it('opens without any interaction', async () => {
    mountVariant(UseModalDefaultModelValue)

    await flushModal()

    expect(isContentVisible()).toBe(true)
  })

  it('renders its slot straight away', async () => {
    mountVariant(UseModalDefaultModelValue)

    await flushModal()

    expect(queryTestId('dynamic-content')?.textContent).toBe('Open from the start')
  })

  it('registers itself on the vfm instance during setup', async () => {
    const { vfm } = mountVariant(UseModalDefaultModelValue)

    await flushModal()

    expect(vfm.dynamicModals).toHaveLength(1)
  })
})
