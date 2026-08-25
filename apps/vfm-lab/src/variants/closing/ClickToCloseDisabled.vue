<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
const outsideClicks = ref(0)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <p data-testid="outside-clicks">{{ outsideClicks }}</p>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    :click-to-close="false"
    @click-outside="outsideClicks++"
  >
    <ModalBody heading="clickToClose: false" @close="show = false">
      <p>Backdrop clicks are reported but do not dismiss the modal.</p>
    </ModalBody>
  </VueFinalModal>
</template>
