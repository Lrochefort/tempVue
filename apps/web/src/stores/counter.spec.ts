import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { COUNTER_MAX, useCounterStore } from './counter.ts'

describe('useCounterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts at zero', () => {
    const store = useCounterStore()

    expect(store.count).toBe(0)
    expect(store.isAtMin).toBe(true)
    expect(store.isAtMax).toBe(false)
  })

  it('increments and exposes a doubled value', () => {
    const store = useCounterStore()

    store.increment()
    store.increment(2)

    expect(store.count).toBe(3)
    expect(store.doubled).toBe(6)
  })

  it('clamps to the maximum', () => {
    const store = useCounterStore()

    store.increment(999)

    expect(store.count).toBe(COUNTER_MAX)
    expect(store.isAtMax).toBe(true)
  })

  it('clamps to the minimum', () => {
    const store = useCounterStore()

    store.decrement(5)

    expect(store.count).toBe(0)
    expect(store.isAtMin).toBe(true)
  })

  it('resets back to zero', () => {
    const store = useCounterStore()

    store.increment(4)
    store.reset()

    expect(store.count).toBe(0)
  })
})
