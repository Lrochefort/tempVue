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
    :content-style="{ padding: '2rem', backgroundColor: 'rgb(240, 240, 240)' }"
  >
    <ModalBody heading="contentStyle: object" @close="show = false">
      <p>Style objects are applied inline to the content element.</p>
    </ModalBody>
  </VueFinalModal>
</template>
