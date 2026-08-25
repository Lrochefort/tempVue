<script setup lang="ts">
import { ModalsContainer, useModal, useModalSlot, VueFinalModal } from '@lrochefort/vue-final-modal'
import { markRaw, useAttrs } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const passthrough = { ...useAttrs() }

const { open, close } = useModal({
  component: VueFinalModal,
  attrs: passthrough,
  slots: {
    default: useModalSlot({
      component: markRaw(ModalBody),
      // Slot attrs carry event listeners too, which is how a dynamic modal's
      // content gets to close the modal that owns it.
      attrs: { heading: 'Rendered through useModalSlot', onClose: () => close() },
    }),
  },
})
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>
  <button data-testid="close" type="button" @click="close()">Close</button>

  <ModalsContainer />
</template>
