<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" swipe-to-close="down" :threshold="120">
    <ModalBody heading="Swipe threshold" @close="show = false">
      <p>Short drags are ignored; the gesture only counts past 120px.</p>
    </ModalBody>
  </VueFinalModal>
</template>
