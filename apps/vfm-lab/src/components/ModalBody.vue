<script setup lang="ts">
defineProps<{ heading: string }>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="lab-modal" data-testid="content">
    <h2 data-testid="content-heading">{{ heading }}</h2>
    <slot />
    <div class="lab-modal__actions">
      <button data-testid="content-close" type="button" @click="emit('close')">Close</button>
    </div>
  </div>
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
