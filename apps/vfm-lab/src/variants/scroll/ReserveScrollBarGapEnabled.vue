<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" lock-scroll reserve-scroll-bar-gap>
    <ModalBody heading="reserveScrollBarGap enabled" @close="show = false">
      <p>The default: padding compensates for the hidden scrollbar to avoid a layout shift.</p>
    </ModalBody>
  </VueFinalModal>
</template>
