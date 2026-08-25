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
    :content-style="[{ padding: '1rem' }, { border: '2px solid rgb(0, 0, 255)' }]"
  >
    <ModalBody heading="contentStyle: array" @close="show = false">
      <p>Arrays of style objects are merged left to right.</p>
    </ModalBody>
  </VueFinalModal>
</template>
