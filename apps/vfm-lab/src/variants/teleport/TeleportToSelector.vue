<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { onMounted, ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)

// Vue resolves Teleport targets at mount and forbids targets rendered by the
// same component: mounting the modal in the same pass crashes the renderer in
// a real browser (jsdom never noticed). Defer one tick so the target exists.
const targetReady = ref(false)
onMounted(() => {
  targetReady.value = true
})
</script>

<template>
  <div id="vfm-lab-teleport-target" data-testid="teleport-target" />

  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal
    v-if="targetReady"
    v-bind="$attrs"
    v-model="show"
    teleport-to="#vfm-lab-teleport-target"
  >
    <ModalBody heading="teleportTo: custom selector" @close="show = false">
      <p>Teleported into a specific element rather than the document body.</p>
    </ModalBody>
  </VueFinalModal>
</template>
