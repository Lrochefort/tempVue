<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <button data-testid="outside-target" type="button">Outside</button>

  <VueFinalModal v-bind="$attrs" v-model="show" :focus-trap="false">
    <ModalBody heading="Focus trap disabled" @close="show = false">
      <p>Focus is free to leave the modal.</p>
    </ModalBody>
  </VueFinalModal>
</template>
