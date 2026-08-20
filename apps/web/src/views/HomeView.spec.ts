import { createVfm } from '@lrochefort/vue-final-modal'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomeView from './HomeView.vue'

function mountHomeView() {
  const vfm = createVfm()
  const wrapper = mount(HomeView, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false }), vfm],
    },
  })

  return { vfm, wrapper }
}

describe('HomeView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders a slug derived from the title', () => {
    const { wrapper } = mountHomeView()

    expect(wrapper.get('[data-testid="slug"]').text()).toContain('vue-3-vite-pinia')
  })

  it('renders a formatted price', () => {
    const { wrapper } = mountHomeView()

    expect(wrapper.get('[data-testid="price"]').text()).toContain('1,499.99')
  })

  it('recomputes the slug when the title changes', async () => {
    const { wrapper } = mountHomeView()

    await wrapper.get('[data-testid="title-input"]').setValue('Hello Composition API!')

    expect(wrapper.get('[data-testid="slug"]').text()).toContain('hello-composition-api')
  })

  it('persists the title to localStorage', async () => {
    const { wrapper } = mountHomeView()

    await wrapper.get('[data-testid="title-input"]').setValue('Persisted')

    expect(localStorage.getItem('home:title')).toContain('Persisted')
  })

  it('embeds the counter card', () => {
    const { wrapper } = mountHomeView()

    expect(wrapper.find('[data-testid="count"]').exists()).toBe(true)
  })

  it('registers a dynamic modal when the trigger is clicked', async () => {
    const { vfm, wrapper } = mountHomeView()

    expect(vfm.dynamicModals).toHaveLength(0)

    await wrapper.get('[data-testid="open-modal"]').trigger('click')

    expect(vfm.dynamicModals).toHaveLength(1)
  })
})
