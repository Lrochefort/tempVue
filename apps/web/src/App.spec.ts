import { createVfm } from '@lrochefort/vue-final-modal'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { routes } from '@/router/index.ts'

import App from './App.vue'

async function mountApp(path = '/') {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()

  const wrapper = mount(App, {
    global: {
      plugins: [router, createTestingPinia({ createSpy: vi.fn, stubActions: false }), createVfm()],
    },
  })

  await flushPromises()

  return wrapper
}

describe('App', () => {
  it('renders the header and the home route', async () => {
    const wrapper = await mountApp('/')

    expect(wrapper.find('.app-header__brand').exists()).toBe(true)
    expect(wrapper.find('[data-testid="count"]').exists()).toBe(true)
  })

  it('renders the about route', async () => {
    const wrapper = await mountApp('/about')

    expect(wrapper.text()).toContain('pnpm monorepo')
  })

  it('renders the not-found route for unknown paths', async () => {
    const wrapper = await mountApp('/nope')

    expect(wrapper.text()).toContain('That page does not exist.')
  })
})
