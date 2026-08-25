<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" content-transition="vfm-slide-down">
    <ModalBody heading="Slide down transition" @close="show = false">
      <p>The content enters from below the viewport.</p>
    </ModalBody>
  </VueFinalModal>
</template>
