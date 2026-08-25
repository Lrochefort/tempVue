<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
const blockOpen = ref(false)
const blockClose = ref(false)

function onBeforeOpen(event: { stop: () => void }): void {
  if (blockOpen.value) {
    event.stop()
  }
}

function onBeforeClose(event: { stop: () => void }): void {
  if (blockClose.value) {
    event.stop()
  }
}
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <button data-testid="block-open" type="button" @click="blockOpen = !blockOpen">
    Toggle block open
  </button>
  <button data-testid="block-close" type="button" @click="blockClose = !blockClose">
    Toggle block close
  </button>
  <p data-testid="flags">
    {{ blockOpen ? 'block-open' : '' }} {{ blockClose ? 'block-close' : '' }}
  </p>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    @before-open="onBeforeOpen"
    @before-close="onBeforeClose"
  >
    <ModalBody heading="Vetoing open and close" @close="show = false">
      <p>Lifecycle events can be cancelled with <code>stop()</code>.</p>
    </ModalBody>
  </VueFinalModal>
</template>
