<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" display-directive="if">
    <ModalBody heading="displayDirective: if" @close="show = false">
      <p>While closed, nothing is rendered into the DOM at all.</p>
    </ModalBody>
  </VueFinalModal>
</template>
