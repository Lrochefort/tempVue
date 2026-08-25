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
    :content-transition="{
      name: 'lab-zoom',
      enterFromClass: 'lab-zoom--from',
      enterActiveClass: 'lab-zoom--entering',
      leaveToClass: 'lab-zoom--to',
    }"
  >
    <ModalBody heading="Custom transition object" @close="show = false">
      <p>Any Vue <code>TransitionProps</code> object is forwarded to the underlying transition.</p>
    </ModalBody>
  </VueFinalModal>
</template>
