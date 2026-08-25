<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
const highlighted = ref(true)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <button data-testid="toggle-highlight" type="button" @click="highlighted = !highlighted">
    Toggle highlight
  </button>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    :content-class="['lab-content', { 'lab-content--highlighted': highlighted }]"
  >
    <ModalBody heading="contentClass: array + object" @close="show = false">
      <p>Vue's array and object class syntax is supported and stays reactive.</p>
    </ModalBody>
  </VueFinalModal>
</template>
