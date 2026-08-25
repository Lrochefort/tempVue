<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" swipe-to-close="left">
    <ModalBody heading="swipeToClose: left" @close="show = false">
      <p>Dragging towards the left edge dismisses the modal.</p>
    </ModalBody>
  </VueFinalModal>
</template>
