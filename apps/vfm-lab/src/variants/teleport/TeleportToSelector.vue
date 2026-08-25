<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <div id="vfm-lab-teleport-target" data-testid="teleport-target" />

  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" teleport-to="#vfm-lab-teleport-target">
    <ModalBody heading="teleportTo: custom selector" @close="show = false">
      <p>Teleported into a specific element rather than the document body.</p>
    </ModalBody>
  </VueFinalModal>
</template>
