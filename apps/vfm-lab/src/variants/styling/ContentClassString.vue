<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" content-class="lab-content lab-content--plain">
    <ModalBody heading="contentClass: string" @close="show = false">
      <p>A space-separated class string is applied to the content element.</p>
    </ModalBody>
  </VueFinalModal>
</template>
