<script setup lang="ts">
import { BaseCard } from '@tempvue/ui'
</script>

<template>
  <BaseCard title="About">
    <p>
      A pnpm monorepo running Vue 3 with the Composition API, Pinia, Vue Router, Vite and Vitest.
      Linting and formatting are handled by the oxc toolchain (oxlint + oxfmt), and Vite bundles
      through Rolldown.
    </p>

    <ul>
      <li><code>apps/web</code> — the application</li>
      <li><code>packages/ui</code> — shared Vue components</li>
      <li><code>packages/utils</code> — framework-agnostic helpers bundled with tsdown</li>
    </ul>
  </BaseCard>
</template>
