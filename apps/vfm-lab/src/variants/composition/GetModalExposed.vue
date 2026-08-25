<script setup lang="ts">
import { getModalExposed, useVfm, VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const vfm = useVfm()
const show = ref(false)
const modalId = 'lab-exposed'
const report = ref('')

// `getModalExposed` hands back a `ComputedRef<ModalExposed>`, and every field on
// it is itself a ref, so reading a value takes two hops.
function inspect(): void {
  const exposed = getModalExposed(vfm.get(modalId))?.value

  report.value =
    exposed === undefined
      ? 'not-registered'
      : `${String(exposed.modalId?.value)}:${exposed.overlayBehavior.value}:${exposed.overlayVisible.value}`
}

function toggleThroughExposed(): void {
  getModalExposed(vfm.get(modalId))?.value.toggle()
}
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <button data-testid="inspect" type="button" @click="inspect">Inspect</button>
  <button data-testid="toggle-exposed" type="button" @click="toggleThroughExposed">Toggle</button>
  <span data-testid="report">{{ report }}</span>

  <VueFinalModal v-bind="$attrs" v-model="show" :modal-id="modalId" overlay-behavior="persist">
    <ModalBody heading="getModalExposed" @close="show = false">
      <p>The instance registered under a modal id exposes its internal refs.</p>
    </ModalBody>
  </VueFinalModal>
</template>
