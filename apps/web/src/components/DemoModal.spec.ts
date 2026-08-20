import { createVfm } from '@lrochefort/vue-final-modal'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import DemoModal from './DemoModal.vue'

let wrapper: VueWrapper | undefined

async function mountDemoModal() {
  wrapper = mount(DemoModal, {
    props: { title: 'Hello' },
    // `modelValue` / `focusTrap` fall through to the underlying VueFinalModal.
    // focus-trap needs a real layout engine, so it stays off under jsdom.
    attrs: { modelValue: true, focusTrap: false },
    global: { plugins: [createVfm()] },
    attachTo: document.body,
  })

  await nextTick()
  await nextTick()

  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

describe('DemoModal', () => {
  it('renders the title into the teleported modal content', async () => {
    await mountDemoModal()

    expect(document.body.querySelector('.demo-modal__title')?.textContent).toBe('Hello')
  })

  it('emits confirm when the button is clicked', async () => {
    const local = await mountDemoModal()

    const button = document.body.querySelector<HTMLButtonElement>('[data-testid="modal-confirm"]')
    expect(button).not.toBeNull()

    button?.click()
    await nextTick()

    expect(local.emitted('confirm')).toHaveLength(1)
  })
})
