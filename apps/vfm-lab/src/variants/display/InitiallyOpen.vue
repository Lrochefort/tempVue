<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(true)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show">
    <ModalBody heading="Initially open" @close="show = false">
      <p>Rendered open on mount, without any interaction.</p>
    </ModalBody>
  </VueFinalModal>
</template>
