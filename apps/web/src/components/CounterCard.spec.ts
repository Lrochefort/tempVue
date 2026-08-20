import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useCounterStore } from '@/stores/counter.ts'

import CounterCard from './CounterCard.vue'

function mountCounterCard(initialCount = 0) {
  const wrapper = mount(CounterCard, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          initialState: { counter: { count: initialCount } },
        }),
      ],
    },
  })

  return { wrapper, store: useCounterStore() }
}

describe('CounterCard', () => {
  it('renders the current and doubled count', () => {
    const { wrapper } = mountCounterCard(3)

    expect(wrapper.get('[data-testid="count"]').text()).toBe('3')
    expect(wrapper.get('[data-testid="doubled"]').text()).toContain('6')
  })

  it('increments through the store', async () => {
    const { wrapper, store } = mountCounterCard()

    await wrapper.get('[data-testid="increment"]').trigger('click')

    expect(store.increment).toHaveBeenCalled()
    expect(store.count).toBe(1)
  })

  it('disables decrement at the minimum', () => {
    const { wrapper } = mountCounterCard(0)

    expect(wrapper.get('[data-testid="decrement"]').attributes('disabled')).toBeDefined()
  })

  it('disables increment at the maximum', () => {
    const { wrapper } = mountCounterCard(10)

    expect(wrapper.get('[data-testid="increment"]').attributes('disabled')).toBeDefined()
  })

  it('resets the counter', async () => {
    const { wrapper, store } = mountCounterCard(7)

    await wrapper.get('[data-testid="reset"]').trigger('click')

    expect(store.count).toBe(0)
  })
})
