<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" teleport-to="body">
    <ModalBody heading="teleportTo: body" @close="show = false">
      <p>Explicitly teleported to <code>document.body</code>.</p>
    </ModalBody>
  </VueFinalModal>
</template>
