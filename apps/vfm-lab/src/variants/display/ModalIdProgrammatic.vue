<script setup lang="ts">
import { useVfm, VueFinalModal } from '@lrochefort/vue-final-modal'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const vfm = useVfm()
const modalId = 'display-modal-id-programmatic'
</script>

<template>
  <button data-testid="trigger" type="button" @click="vfm.open(modalId)">Open</button>
  <button data-testid="toggle" type="button" @click="vfm.toggle(modalId)">Toggle</button>
  <button data-testid="close" type="button" @click="vfm.close(modalId)">Close</button>

  <VueFinalModal v-bind="$attrs" :modal-id="modalId">
    <ModalBody heading="modalId + useVfm" @close="vfm.close(modalId)">
      <p>No <code>v-model</code>: open state is driven entirely by id.</p>
    </ModalBody>
  </VueFinalModal>
</template>
