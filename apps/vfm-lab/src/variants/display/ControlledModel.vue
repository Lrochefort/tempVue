<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <button data-testid="external-close" type="button" @click="show = false">
    Close from parent
  </button>
  <p data-testid="state">{{ show ? 'open' : 'closed' }}</p>

  <VueFinalModal v-bind="$attrs" v-model="show">
    <ModalBody heading="Controlled v-model" @close="show = false">
      <p>The parent owns the open state; the modal only reports changes back.</p>
    </ModalBody>
  </VueFinalModal>
</template>
