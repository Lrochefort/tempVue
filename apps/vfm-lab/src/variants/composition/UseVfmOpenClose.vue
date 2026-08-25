<script setup lang="ts">
import { useVfm, VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const vfm = useVfm()
const show = ref(false)
const modalId = 'lab-use-vfm'
</script>

<template>
  <button data-testid="trigger" type="button" @click="vfm.open(modalId)">Open</button>
  <button data-testid="close-by-id" type="button" @click="vfm.close(modalId)">Close</button>

  <VueFinalModal v-bind="$attrs" v-model="show" :modal-id="modalId">
    <ModalBody heading="Controlled through useVfm" @close="show = false">
      <p>The plugin drives this modal by id, without touching the local ref directly.</p>
    </ModalBody>
  </VueFinalModal>
</template>
