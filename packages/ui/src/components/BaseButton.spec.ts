import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content with default classes', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Save' } })

    expect(wrapper.text()).toBe('Save')
    expect(wrapper.classes()).toContain('base-button--primary')
    expect(wrapper.classes()).toContain('base-button--md')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies variant and size modifiers', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'danger', size: 'lg' } })

    expect(wrapper.classes()).toContain('base-button--danger')
    expect(wrapper.classes()).toContain('base-button--lg')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(BaseButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows a spinner and blocks clicks while loading', async () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })

    await wrapper.trigger('click')

    expect(wrapper.find('.base-button__spinner').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
