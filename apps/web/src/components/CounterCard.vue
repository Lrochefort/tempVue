<script setup lang="ts">
import { useCounterStore } from '@/stores/counter.ts'
import { BaseButton, BaseCard } from '@tempvue/ui'

const store = useCounterStore()
</script>

<template>
  <BaseCard title="Counter">
    <p class="counter__value" data-testid="count">{{ store.count }}</p>
    <p class="counter__meta" data-testid="doubled">Doubled: {{ store.doubled }}</p>

    <template #footer>
      <BaseButton
        variant="secondary"
        :disabled="store.isAtMin"
        data-testid="decrement"
        @click="store.decrement()"
      >
        Decrement
      </BaseButton>
      <BaseButton :disabled="store.isAtMax" data-testid="increment" @click="store.increment()">
        Increment
      </BaseButton>
      <BaseButton variant="ghost" data-testid="reset" @click="store.reset()">Reset</BaseButton>
    </template>
  </BaseCard>
</template>

<style scoped>
.counter__value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.counter__meta {
  margin: 0;
  color: var(--ui-color-muted, #71717a);
}
</style>
