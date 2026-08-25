<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" swipe-to-close="right" show-swipe-banner>
    <ModalBody heading="Swipe banner" @close="show = false">
      <p>
        The banner narrows the gesture area to the screen edges, which is what makes the modal
        scrollable and swipeable at the same time.
      </p>
    </ModalBody>
  </VueFinalModal>
</template>
