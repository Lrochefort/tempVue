<script setup lang="ts">
import { ModalsContainer } from '@lrochefort/vue-final-modal'
</script>

<template>
  <header class="header" data-testid="app-header">
    <div class="header__inner">
      <RouterLink class="brand" data-testid="home-link" to="/">
        <span class="brand__mark" aria-hidden="true" />
        <span class="brand__text">Variant Lab</span>
      </RouterLink>

      <span class="header__tag">vue-final-modal v5</span>
    </div>
  </header>

  <main class="lab-shell" data-testid="app-main">
    <RouterView />
  </main>

  <!-- A single container for every dynamic modal created with `useModal`. -->
  <ModalsContainer />
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--lab-border);
  background: rgb(11 11 18 / 72%);
  backdrop-filter: blur(12px);
}

.header__inner {
  width: min(1120px, 100% - 3rem);
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 60px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.brand__mark {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--lab-accent), #b06cff);
  box-shadow: 0 4px 14px var(--lab-accent-glow);
}

.brand:hover .brand__text {
  color: var(--lab-accent-soft);
}

.header__tag {
  font-family: var(--lab-mono);
  font-size: 0.75rem;
  color: var(--lab-text-faint);
  border: 1px solid var(--lab-border);
  border-radius: 999px;
  padding: 0.15rem 0.65rem;
}
</style>
