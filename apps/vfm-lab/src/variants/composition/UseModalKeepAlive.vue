<script setup lang="ts">
import { ModalsContainer, useModal, VueFinalModal } from '@lrochefort/vue-final-modal'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const passthrough = { ...useAttrs() }

// `keepAlive` forces `displayDirective: "show"` and stops the container from
// discarding the entry once the modal closes.
const { open, close } = useModal({
  keepAlive: true,
  component: VueFinalModal,
  attrs: passthrough,
  slots: { default: '<div data-testid="dynamic-content">Kept alive</div>' },
})
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>
  <button data-testid="close" type="button" @click="close()">Close</button>

  <ModalsContainer />
</template>
