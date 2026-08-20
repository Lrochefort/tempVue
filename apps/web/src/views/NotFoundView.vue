<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { BaseCard } from '@tempvue/ui'
</script>

<template>
  <BaseCard title="404 — Not found">
    <p>That page does not exist.</p>
    <RouterLink to="/">Back home</RouterLink>
  </BaseCard>
</template>
