<script setup lang="ts">
import { useVfm, VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const vfm = useVfm()
const first = ref(false)
const second = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="first = true">Open first</button>
  <button data-testid="trigger-second" type="button" @click="second = true">Open second</button>
  <button data-testid="close-all" type="button" @click="vfm.closeAll()">Close all</button>

  <VueFinalModal v-bind="$attrs" v-model="first" overlay-behavior="persist">
    <ModalBody heading="First of the stack" @close="first = false">
      <p>Both modals are dismissed together.</p>
    </ModalBody>
  </VueFinalModal>

  <VueFinalModal v-bind="$attrs" v-model="second" overlay-behavior="persist">
    <ModalBody heading="Second of the stack" @close="second = false">
      <p>Both modals are dismissed together.</p>
    </ModalBody>
  </VueFinalModal>
</template>
