<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show">
    <ModalBody heading="Default teleport" @close="show = false">
      <p>No <code>teleportTo</code>: the modal renders where the component sits.</p>
    </ModalBody>
  </VueFinalModal>
</template>
