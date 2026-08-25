<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" display-directive="show">
    <ModalBody heading="z-index reset on close" @close="show = false">
      <p>Kept mounted with <code>displayDirective="show"</code> so the reset is observable.</p>
    </ModalBody>
  </VueFinalModal>
</template>
