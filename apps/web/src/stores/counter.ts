import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { clamp } from '@tempvue/utils'

export const COUNTER_MIN = 0
export const COUNTER_MAX = 10

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const doubled = computed(() => count.value * 2)
  const isAtMax = computed(() => count.value >= COUNTER_MAX)
  const isAtMin = computed(() => count.value <= COUNTER_MIN)

  function increment(step = 1) {
    count.value = clamp(count.value + step, COUNTER_MIN, COUNTER_MAX)
  }

  function decrement(step = 1) {
    count.value = clamp(count.value - step, COUNTER_MIN, COUNTER_MAX)
  }

  function reset() {
    count.value = 0
  }

  return { count, decrement, doubled, increment, isAtMax, isAtMin, reset }
})
