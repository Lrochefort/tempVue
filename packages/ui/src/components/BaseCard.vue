<script setup lang="ts">
defineProps<{
  title?: string
}>()

defineSlots<{
  default: () => unknown
  footer?: () => unknown
  header?: () => unknown
}>()
</script>

<template>
  <section class="base-card">
    <header v-if="title || $slots.header" class="base-card__header">
      <slot name="header">
        <h2 class="base-card__title">{{ title }}</h2>
      </slot>
    </header>

    <div class="base-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.base-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--ui-color-surface, #fff);
  border: 1px solid var(--ui-color-border, #d4d4d8);
  border-radius: var(--ui-radius, 0.5rem);
  color: var(--ui-color-text, #18181b);
}

.base-card__title {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.3;
}

.base-card__footer {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--ui-color-border, #d4d4d8);
}
</style>
