<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    overlay-class="lab-overlay lab-overlay--tinted"
    :overlay-style="{ backgroundColor: 'rgb(10, 20, 30)', opacity: '0.8' }"
  >
    <ModalBody heading="Overlay class and style" @close="show = false">
      <p>Custom classes and inline styles are applied to the overlay element.</p>
    </ModalBody>
  </VueFinalModal>
</template>
