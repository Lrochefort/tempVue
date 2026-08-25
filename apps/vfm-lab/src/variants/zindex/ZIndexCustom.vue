<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)

function zIndexFn({ index }: { index: number }): number {
  return 5000 + index * 100
}
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" :z-index-fn="zIndexFn">
    <ModalBody heading="Custom zIndexFn" @close="show = false">
      <p>A custom function decides the stacking value.</p>
    </ModalBody>
  </VueFinalModal>
</template>
