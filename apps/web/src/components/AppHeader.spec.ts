import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { routes } from '@/router/index.ts'

import AppHeader from './AppHeader.vue'

describe('AppHeader', () => {
  it('renders the brand and navigation links', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(AppHeader, { global: { plugins: [router] } })

    expect(wrapper.get('.app-header__brand').text()).toBe('tempVue')

    const links = wrapper.findAll('.app-header__links a')
    expect(links.map((link) => link.text())).toEqual(['Home', 'About'])
  })
})
