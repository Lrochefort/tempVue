<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" swipe-to-close="up">
    <ModalBody heading="swipeToClose: up" @close="show = false">
      <p>Dragging the sheet upwards dismisses it.</p>
    </ModalBody>
  </VueFinalModal>
</template>
