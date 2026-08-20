<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <nav class="app-header__nav" aria-label="Main">
      <RouterLink class="app-header__brand" to="/">tempVue</RouterLink>

      <ul class="app-header__links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--ui-color-border, #d4d4d8);
}

.app-header__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 60rem;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
}

.app-header__brand {
  font-weight: 700;
  font-size: 1.125rem;
  text-decoration: none;
  color: var(--ui-color-text, #18181b);
}

.app-header__links {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-header__links a {
  color: var(--ui-color-muted, #71717a);
  text-decoration: none;
}

.app-header__links a.router-link-active {
  color: var(--ui-color-primary, #10b981);
  font-weight: 600;
}
</style>
