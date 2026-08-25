<script setup lang="ts">
import { ModalsContainer, useModal, VueFinalModal } from '@lrochefort/vue-final-modal'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const passthrough = { ...useAttrs() }

const { open, patchOptions } = useModal({
  component: VueFinalModal,
  attrs: { ...passthrough, contentClass: 'lab-patch--before' },
  slots: { default: '<div data-testid="dynamic-content">Before patching</div>' },
})

function patch(): void {
  patchOptions({
    attrs: { contentClass: 'lab-patch--after' },
    slots: { default: '<div data-testid="dynamic-content">After patching</div>' },
  })
}
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>
  <button data-testid="patch" type="button" @click="patch">Patch</button>

  <ModalsContainer />
</template>
