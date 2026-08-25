<script setup lang="ts">
import { ModalsContainer, useModal, VueFinalModal } from '@lrochefort/vue-final-modal'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const passthrough = { ...useAttrs() }

const { open, close } = useModal({
  defaultModelValue: true,
  component: VueFinalModal,
  attrs: passthrough,
  slots: { default: '<div data-testid="dynamic-content">Open from the start</div>' },
})
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>
  <button data-testid="close" type="button" @click="close()">Close</button>

  <ModalsContainer />
</template>
