<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" swipe-to-close="left" show-swipe-banner>
    <template #swipe-banner>
      <div data-testid="custom-banner" class="lab-banner">Drag from here</div>
    </template>

    <ModalBody heading="Custom swipe banner" @close="show = false">
      <p>The <code>swipe-banner</code> slot replaces the two default edge strips.</p>
    </ModalBody>
  </VueFinalModal>
</template>
