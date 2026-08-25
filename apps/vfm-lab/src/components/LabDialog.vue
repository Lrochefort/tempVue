<script setup lang="ts">
import { useVfmAttrs, VueFinalModal, vueFinalModalProps } from '@lrochefort/vue-final-modal'

defineOptions({ inheritAttrs: false })

// Re-declaring the library's props is what makes a wrapper transparent:
// `useVfmAttrs` then picks them back out, re-emits every modal event, and
// forwards any leftover fallthrough attribute.
const props = defineProps({
  ...vueFinalModalProps,
  heading: { type: String, required: true },
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  beforeOpen: [event: { stop: () => void }]
  opened: []
  beforeClose: [event: { stop: () => void }]
  closed: []
  confirm: []
}>()

const modalAttrs = useVfmAttrs({ props, modalProps: vueFinalModalProps, emit })
</script>

<template>
  <VueFinalModal v-bind="modalAttrs">
    <div class="lab-modal" data-testid="content">
      <h2 data-testid="content-heading">{{ heading }}</h2>
      <slot />
      <div class="lab-modal__actions">
        <button data-testid="content-close" type="button" @click="emit('update:modelValue', false)">
          Close
        </button>
        <button data-testid="confirm" type="button" @click="emit('confirm')">Confirm</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
.lab-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--lab-border);
}
</style>
