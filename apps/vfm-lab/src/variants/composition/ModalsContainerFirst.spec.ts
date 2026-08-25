import { describe, expect, it } from 'vitest'

import { mountVariant, openVariant, queryAllContents, queryAllRoots } from '@/test/helpers'

import ModalsContainerFirst from './ModalsContainerFirst.vue'

describe('composition/modals-container-first', () => {
  it('renders the modal exactly once despite three containers', async () => {
    const { wrapper } = mountVariant(ModalsContainerFirst)

    await openVariant(wrapper)

    expect(queryAllContents()).toHaveLength(1)
  })

  it('creates a single modal root', async () => {
    const { wrapper } = mountVariant(ModalsContainerFirst)

    await openVariant(wrapper)

    expect(queryAllRoots()).toHaveLength(1)
  })

  it('registers every container on the vfm instance', () => {
    const { vfm } = mountVariant(ModalsContainerFirst)

    expect(vfm.modalsContainers.value).toHaveLength(3)
  })
})
