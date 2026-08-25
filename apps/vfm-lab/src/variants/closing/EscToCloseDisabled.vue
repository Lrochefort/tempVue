<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" :esc-to-close="false">
    <ModalBody heading="escToClose: false" @close="show = false">
      <p>Escape is ignored; the modal must be dismissed explicitly.</p>
    </ModalBody>
  </VueFinalModal>
</template>
