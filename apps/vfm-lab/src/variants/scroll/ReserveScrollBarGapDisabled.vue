<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" lock-scroll :reserve-scroll-bar-gap="false">
    <ModalBody heading="reserveScrollBarGap disabled" @close="show = false">
      <p>No compensating padding is added when the scrollbar disappears.</p>
    </ModalBody>
  </VueFinalModal>
</template>
