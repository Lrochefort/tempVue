<script setup lang="ts">
import { ModalsContainer, useModal, VueFinalModal } from '@lrochefort/vue-final-modal'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const passthrough = { ...useAttrs() }

const { open } = useModal({
  component: VueFinalModal,
  attrs: passthrough,
  slots: { default: '<div data-testid="dynamic-content">Rendered once</div>' },
})
</script>

<template>
  <button data-testid="trigger" type="button" @click="open()">Open</button>

  <!-- Only the container registered first renders the dynamic modals, so mounting
       several of them is harmless rather than duplicating every modal. -->
  <ModalsContainer />
  <ModalsContainer />
  <ModalsContainer />
</template>
