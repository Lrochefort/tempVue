<script setup lang="ts">
import { ModalsContainer } from '@lrochefort/vue-final-modal'
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />

  <main class="app-main">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <ModalsContainer />
</template>

<style scoped>
.app-main {
  max-width: 60rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
