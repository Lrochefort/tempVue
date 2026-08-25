<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" background="interactive" hide-overlay>
    <ModalBody heading="Interactive background" @close="show = false">
      <p>Pointer events pass through the modal root so the page stays usable.</p>
    </ModalBody>
  </VueFinalModal>
</template>
