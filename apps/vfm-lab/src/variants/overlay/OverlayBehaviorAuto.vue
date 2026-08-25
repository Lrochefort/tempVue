<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const first = ref(false)
const second = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="first = true">Open first</button>
  <button data-testid="trigger-second" type="button" @click="second = true">Open second</button>
  <button data-testid="close-second" type="button" @click="second = false">Close second</button>

  <VueFinalModal v-bind="$attrs" v-model="first" overlay-behavior="auto">
    <ModalBody heading="overlayBehavior: auto (first)" @close="first = false">
      <p>With <code>auto</code>, only the topmost modal keeps its overlay visible.</p>
    </ModalBody>
  </VueFinalModal>

  <VueFinalModal v-bind="$attrs" v-model="second" overlay-behavior="auto">
    <ModalBody heading="overlayBehavior: auto (second)" @close="second = false">
      <p>Stacked on top of the first modal.</p>
    </ModalBody>
  </VueFinalModal>
</template>
