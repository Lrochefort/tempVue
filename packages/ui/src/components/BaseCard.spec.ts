import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseCard from './BaseCard.vue'

describe('BaseCard', () => {
  it('renders the title when provided', () => {
    const wrapper = mount(BaseCard, {
      props: { title: 'Metrics' },
      slots: { default: 'body' },
    })

    expect(wrapper.find('.base-card__title').text()).toBe('Metrics')
    expect(wrapper.find('.base-card__body').text()).toBe('body')
  })

  it('omits the header when there is no title or header slot', () => {
    const wrapper = mount(BaseCard, { slots: { default: 'body' } })

    expect(wrapper.find('.base-card__header').exists()).toBe(false)
  })

  it('renders the footer slot when supplied', () => {
    const wrapper = mount(BaseCard, {
      slots: { default: 'body', footer: 'actions' },
    })

    expect(wrapper.find('.base-card__footer').text()).toBe('actions')
  })
})
