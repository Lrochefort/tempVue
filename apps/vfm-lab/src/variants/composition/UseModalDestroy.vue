<script setup lang="ts">
import { ModalsContainer, useModal, useVfm, VueFinalModal } from '@lrochefort/vue-final-modal'
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const passthrough = { ...useAttrs() }
const vfm = useVfm()

const { open, destroy } = useModal({
  component: VueFinalModal,
  attrs: passthrough,
  slots: { default: '<div data-testid="dynamic-content">Disposable</div>' },
})

const registered = computed(() => vfm.dynamicModals.length)
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>
  <button data-testid="destroy" type="button" @click="destroy">Destroy</button>
  <span data-testid="registered-count">{{ registered }}</span>

  <ModalsContainer />
</template>
