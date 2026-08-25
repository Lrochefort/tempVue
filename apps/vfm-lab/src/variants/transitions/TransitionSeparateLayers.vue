<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    overlay-transition="vfm-fade"
    content-transition="vfm-slide-down"
  >
    <ModalBody heading="Separate layer transitions" @close="show = false">
      <p>The overlay and the content animate independently.</p>
    </ModalBody>
  </VueFinalModal>
</template>
