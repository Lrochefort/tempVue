import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { routes } from '@/router/index.ts'

import AboutView from './AboutView.vue'
import NotFoundView from './NotFoundView.vue'

describe('AboutView', () => {
  it('describes the workspace layout', () => {
    const wrapper = mount(AboutView)

    expect(wrapper.text()).toContain('pnpm monorepo')
    expect(wrapper.findAll('li')).toHaveLength(3)
  })
})

describe('NotFoundView', () => {
  it('renders a link back home', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(NotFoundView, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('That page does not exist.')
    expect(wrapper.get('a').attributes('href')).toBe('/')
  })
})
