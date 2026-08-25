<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" :teleport-to="false">
    <ModalBody heading="teleportTo: false" @close="show = false">
      <p>Teleporting is disabled, so the modal renders inline where it is declared.</p>
    </ModalBody>
  </VueFinalModal>
</template>
