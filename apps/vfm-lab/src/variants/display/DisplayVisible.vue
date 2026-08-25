<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" display-directive="visible">
    <ModalBody heading="displayDirective: visible" @close="show = false">
      <p>Stays mounted and keeps its layout box, hidden with <code>visibility: hidden</code>.</p>
    </ModalBody>
  </VueFinalModal>
</template>
