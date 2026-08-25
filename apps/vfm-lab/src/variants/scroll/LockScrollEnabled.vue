<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" lock-scroll>
    <ModalBody heading="lockScroll enabled" @close="show = false">
      <p>The default: body scrolling is locked while the modal is open.</p>
    </ModalBody>
  </VueFinalModal>
</template>
