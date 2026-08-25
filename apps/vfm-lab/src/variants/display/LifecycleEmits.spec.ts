import type { VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { closeFromContent, mountVariant, openVariant } from '@/test/helpers'

import LifecycleEmits from './LifecycleEmits.vue'

function loggedEvents(wrapper: VueWrapper): string[] {
  return wrapper.findAll('[data-testid="event"]').map((node) => node.text())
}

describe('display/lifecycle-emits', () => {
  it('emits beforeOpen then opened, in that order', async () => {
    const { wrapper } = mountVariant(LifecycleEmits)

    await openVariant(wrapper)

    expect(loggedEvents(wrapper)).toEqual(['beforeOpen', 'opened'])
  })

  it('emits beforeClose then closed, in that order', async () => {
    const { wrapper } = mountVariant(LifecycleEmits)
    await openVariant(wrapper)

    await closeFromContent()

    expect(loggedEvents(wrapper)).toEqual(['beforeOpen', 'opened', 'beforeClose', 'closed'])
  })

  it('emits a clean sequence across repeated open/close cycles', async () => {
    const { wrapper } = mountVariant(LifecycleEmits)

    await openVariant(wrapper)
    await closeFromContent()
    await openVariant(wrapper)
    await closeFromContent()

    expect(loggedEvents(wrapper)).toEqual([
      'beforeOpen',
      'opened',
      'beforeClose',
      'closed',
      'beforeOpen',
      'opened',
      'beforeClose',
      'closed',
    ])
  })

  it('does not emit clickOutside during a normal open/close cycle', async () => {
    const { wrapper } = mountVariant(LifecycleEmits)

    await openVariant(wrapper)
    await closeFromContent()

    expect(loggedEvents(wrapper)).not.toContain('clickOutside')
  })
})
