<script setup lang="ts">
import { computed } from 'vue'

import { findVariant } from '@/variants/registry'

const props = defineProps<{ group: string; id: string }>()

const variant = computed(() => findVariant(props.group, props.id))
</script>

<template>
  <section v-if="variant" data-testid="variant">
    <nav class="crumbs">
      <RouterLink class="crumbs__link" to="/">Lab</RouterLink>
      <span class="crumbs__sep" aria-hidden="true">/</span>
      <RouterLink class="crumbs__link" :to="`/${group}`">{{ group }}</RouterLink>
      <span class="crumbs__sep" aria-hidden="true">/</span>
      <span class="crumbs__current">{{ id }}</span>
    </nav>

    <header class="head">
      <h1 class="head__title" data-testid="variant-title">{{ variant.title }}</h1>
      <p class="head__desc" data-testid="variant-description">{{ variant.description }}</p>
    </header>

    <p v-if="variant.jsdomCaveat" class="caveat" data-testid="variant-caveat">
      {{ variant.jsdomCaveat }}
    </p>

    <div class="stage">
      <span class="stage__label">Live demo</span>
      <div class="lab-demo" data-testid="variant-demo">
        <component :is="variant.component" />
      </div>
    </div>
  </section>

  <section v-else class="missing" data-testid="variant-missing">
    <h1 class="missing__title">Nothing here</h1>
    <p>
      No variant registered as <code>{{ group }}/{{ id }}</code
      >.
    </p>
    <RouterLink class="lab-btn missing__back" to="/">Back to the lab</RouterLink>
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
  max-width: 46rem;
  margin-bottom: 1.75rem;
}

.head__title {
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  margin-bottom: 0.65rem;
}

.head__desc {
  font-size: 1.02rem;
  color: var(--lab-text-muted);
}

.caveat {
  max-width: 46rem;
  margin-bottom: 1.75rem;
  padding: 0.85rem 1.1rem;
  font-size: 0.9rem;
  color: var(--lab-warn);
  border-radius: var(--lab-radius-sm);
  border: 1px solid rgb(255 176 87 / 30%);
  border-left: 3px solid var(--lab-warn);
  background: rgb(255 176 87 / 8%);
}

.stage {
  position: relative;
  border-radius: var(--lab-radius);
  border: 1px solid var(--lab-border);
  background:
    repeating-linear-gradient(45deg, rgb(255 255 255 / 2%) 0 10px, transparent 10px 20px),
    linear-gradient(var(--lab-bg-elevated), var(--lab-bg-elevated));
  padding: 2.5rem 1.5rem;
}

.stage__label {
  position: absolute;
  top: 0.7rem;
  left: 1rem;
  font-family: var(--lab-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lab-text-faint);
}

.lab-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.missing {
  text-align: center;
  padding: 5rem 1rem;
}

.missing__title {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
}

.missing__back {
  display: inline-block;
  margin-top: 1.5rem;
  text-decoration: none;
}
</style>
