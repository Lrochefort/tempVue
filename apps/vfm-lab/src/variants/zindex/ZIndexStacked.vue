<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const first = ref(false)
const second = ref(false)
const third = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="first = true">Open first</button>
  <button data-testid="trigger-second" type="button" @click="second = true">Open second</button>
  <button data-testid="trigger-third" type="button" @click="third = true">Open third</button>

  <VueFinalModal v-bind="$attrs" v-model="first" overlay-behavior="persist">
    <ModalBody heading="Stacked z-index (1)" @close="first = false">
      <p>Each stacked modal receives a higher z-index than the one below it.</p>
    </ModalBody>
  </VueFinalModal>

  <VueFinalModal v-bind="$attrs" v-model="second" overlay-behavior="persist">
    <ModalBody heading="Stacked z-index (2)" @close="second = false">
      <p>Second in the stack.</p>
    </ModalBody>
  </VueFinalModal>

  <VueFinalModal v-bind="$attrs" v-model="third" overlay-behavior="persist">
    <ModalBody heading="Stacked z-index (3)" @close="third = false">
      <p>Third in the stack.</p>
    </ModalBody>
  </VueFinalModal>
</template>
