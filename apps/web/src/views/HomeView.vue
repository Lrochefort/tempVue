<script setup lang="ts">
import { useModal } from '@lrochefort/vue-final-modal'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

import CounterCard from '@/components/CounterCard.vue'
import DemoModal from '@/components/DemoModal.vue'
import { BaseButton, BaseCard } from '@tempvue/ui'
import { formatCurrency, slugify } from '@tempvue/utils'

const title = useLocalStorage('home:title', 'Vue 3 + Vite + Pinia')
const slug = computed(() => slugify(title.value))
const price = computed(() => formatCurrency(1499.99))

const { open, close } = useModal({
  component: DemoModal,
  attrs: {
    title: 'Hello from vue-final-modal',
    onConfirm() {
      void close()
    },
  },
})
</script>

<template>
  <div class="home">
    <BaseCard title="Playground">
      <label class="home__field">
        <span>Title</span>
        <input v-model="title" type="text" data-testid="title-input" />
      </label>

      <p data-testid="slug">
        Slug: <code>{{ slug }}</code>
      </p>
      <p data-testid="price">Price: {{ price }}</p>

      <template #footer>
        <BaseButton data-testid="open-modal" @click="open()">Open modal</BaseButton>
      </template>
    </BaseCard>

    <CounterCard />
  </div>
</template>

<style scoped>
.home {
  display: grid;
  gap: 1.5rem;
}

.home__field {
  display: grid;
  gap: 0.375rem;
}

.home__field input {
  padding: 0.5rem 0.75rem;
  font: inherit;
  border: 1px solid var(--ui-color-border, #d4d4d8);
  border-radius: var(--ui-radius, 0.5rem);
  background: transparent;
  color: inherit;
}
</style>
