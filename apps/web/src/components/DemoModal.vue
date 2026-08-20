<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'

import { BaseButton } from '@tempvue/ui'

defineProps<{
  title: string
}>()

defineEmits<{
  confirm: []
}>()
</script>

<template>
  <VueFinalModal
    class="demo-modal"
    content-class="demo-modal__content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <h3 class="demo-modal__title">{{ title }}</h3>
    <p>This modal is rendered through the app-level <code>ModalsContainer</code>.</p>

    <BaseButton data-testid="modal-confirm" @click="$emit('confirm')">Got it</BaseButton>
  </VueFinalModal>
</template>

<style>
.demo-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-modal__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 28rem;
  padding: 1.5rem;
  background: var(--ui-color-surface, #fff);
  border: 1px solid var(--ui-color-border, #d4d4d8);
  border-radius: var(--ui-radius, 0.5rem);
}

.demo-modal__title {
  margin: 0;
}
</style>
