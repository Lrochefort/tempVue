<script setup lang="ts">
import { computed } from 'vue'

import { variantsInGroup } from '@/variants/registry'
import type { VariantGroup } from '@/variants/types'

const props = defineProps<{ group: VariantGroup }>()

const items = computed(() => variantsInGroup(props.group))
</script>

<template>
  <section data-testid="group">
    <nav class="crumbs">
      <RouterLink class="crumbs__link" to="/">Lab</RouterLink>
      <span class="crumbs__sep" aria-hidden="true">/</span>
      <span class="crumbs__current">{{ group }}</span>
    </nav>

    <header class="head">
      <h1 class="head__title" data-testid="group-title">{{ group }}</h1>
      <span class="head__count">{{ items.length }} variants</span>
    </header>

    <ul class="grid" data-testid="variant-list">
      <li v-for="variant in items" :key="variant.id" class="card">
        <RouterLink
          class="card__title"
          :data-testid="`variant-link-${variant.id}`"
          :to="`/${group}/${variant.id}`"
        >
          {{ variant.title }}
        </RouterLink>

        <p class="card__desc">{{ variant.description }}</p>

        <span v-if="variant.jsdomCaveat" class="card__flag">jsdom caveat</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.crumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--lab-text-faint);
  margin-bottom: 1rem;
}

.crumbs__link:hover {
  color: var(--lab-accent-soft);
}

.crumbs__current {
  font-family: var(--lab-mono);
  color: var(--lab-text-muted);
}

.head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--lab-border);
}

.head__title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-family: var(--lab-mono);
}

.head__count {
  font-size: 0.8rem;
  color: var(--lab-text-faint);
  font-variant-numeric: tabular-nums;
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
  gap: 1rem;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.15rem 1.25rem;
  border-radius: var(--lab-radius);
  border: 1px solid var(--lab-border);
  background: var(--lab-surface);
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: var(--lab-accent);
  background: var(--lab-surface-hover);
}

.card__title {
  font-weight: 600;
  font-size: 1rem;
}

/* Stretch the link over the whole card so the entire tile is clickable. */
.card__title::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.card__desc {
  font-size: 0.88rem;
  color: var(--lab-text-muted);
}

.card__flag {
  align-self: flex-start;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lab-warn);
  border: 1px solid rgb(255 176 87 / 35%);
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}
</style>
