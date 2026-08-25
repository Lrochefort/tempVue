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
    :focus-trap="{
      allowOutsideClick: false,
      escapeDeactivates: false,
      tabbableOptions: { displayCheck: 'none' },
    }"
  >
    <ModalBody heading="Focus trap options" @close="show = false">
      <p>
        <code>focus-trap</code> options are forwarded verbatim. <code>displayCheck: 'none'</code> is
        what makes the trap usable under jsdom.
      </p>
    </ModalBody>
  </VueFinalModal>
</template>
