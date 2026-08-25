<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" hide-overlay>
    <ModalBody heading="hideOverlay" @close="show = false">
      <p>No overlay element is rendered at all.</p>
    </ModalBody>
  </VueFinalModal>
</template>
