<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" background="non-interactive">
    <ModalBody heading="Non-interactive background" @close="show = false">
      <p>The default: the modal root captures pointer events.</p>
    </ModalBody>
  </VueFinalModal>
</template>
