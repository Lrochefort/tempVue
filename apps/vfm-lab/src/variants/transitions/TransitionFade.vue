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
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
  >
    <ModalBody heading="Fade transition" @close="show = false">
      <p>The built-in <code>vfm-fade</code> preset, applied to both layers.</p>
    </ModalBody>
  </VueFinalModal>
</template>
