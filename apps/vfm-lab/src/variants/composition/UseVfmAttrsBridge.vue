<script setup lang="ts">
import { ref } from 'vue'

import LabDialog from '@/components/LabDialog.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
const confirmed = ref(false)
const closedCount = ref(0)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <span data-testid="confirmed">{{ confirmed }}</span>
  <span data-testid="closed-count">{{ closedCount }}</span>

  <LabDialog
    v-bind="$attrs"
    v-model="show"
    heading="Bridged through useVfmAttrs"
    content-class="lab-bridged"
    @confirm="confirmed = true"
    @closed="closedCount += 1"
  >
    <p>A wrapper component that stays a drop-in replacement for the modal itself.</p>
  </LabDialog>
</template>
