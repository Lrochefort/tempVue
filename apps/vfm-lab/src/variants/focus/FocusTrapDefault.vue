<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show">
    <ModalBody heading="Default focus trap" @close="show = false">
      <p>
        The default is <code>{ allowOutsideClick: true }</code>. Under jsdom the
        <code>focus-trap</code> visibility check cannot see any tabbable node, so this variant is
        exercised through its wiring rather than real focus behaviour.
      </p>
    </ModalBody>
  </VueFinalModal>
</template>
