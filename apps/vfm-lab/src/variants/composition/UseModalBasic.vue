<script setup lang="ts">
import { ModalsContainer, useModal, VueFinalModal } from '@lrochefort/vue-final-modal'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

// The harness injects test-only attrs (such as `focusTrap: false`); a dynamic
// modal has no template to forward them through, so they are folded into the
// options instead.
const passthrough = { ...useAttrs() }

const { open, close } = useModal({
  component: VueFinalModal,
  attrs: passthrough,
  slots: {
    default: '<div data-testid="dynamic-content">Created entirely from script</div>',
  },
})
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>
  <button data-testid="close" type="button" @click="close()">Close</button>

  <ModalsContainer />
</template>
