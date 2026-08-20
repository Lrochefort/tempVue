<script setup lang="ts">
import { computed } from 'vue'

import type { ButtonSize, ButtonVariant } from './button-types.ts'

const {
  disabled = false,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
} = defineProps<{
  disabled?: boolean
  loading?: boolean
  size?: ButtonSize
  type?: 'button' | 'reset' | 'submit'
  variant?: ButtonVariant
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isDisabled = computed(() => disabled || loading)

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading"
    @click="onClick"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--ui-radius, 0.5rem);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.base-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.base-button:not(:disabled):active {
  transform: translateY(1px);
}

.base-button--sm {
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
}

.base-button--md {
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
}

.base-button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.0625rem;
}

.base-button--primary {
  background: var(--ui-color-primary, #10b981);
  color: var(--ui-color-primary-contrast, #04231a);
}

.base-button--secondary {
  background: transparent;
  border-color: var(--ui-color-border, #d4d4d8);
  color: var(--ui-color-text, #18181b);
}

.base-button--danger {
  background: var(--ui-color-danger, #f43f5e);
  color: #fff;
}

.base-button--ghost {
  background: transparent;
  color: var(--ui-color-text, #18181b);
}

.base-button__spinner {
  width: 0.75em;
  height: 0.75em;
  border: 2px solid currentcolor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: base-button-spin 700ms linear infinite;
}

@keyframes base-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
