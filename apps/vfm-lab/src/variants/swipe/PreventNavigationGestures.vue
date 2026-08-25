<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show" swipe-to-close="right" prevent-navigation-gestures>
    <ModalBody heading="Prevent navigation gestures" @close="show = false">
      <p>
        Without <code>showSwipeBanner</code>, this renders the same edge container purely to swallow
        the browser's back/forward gestures.
      </p>
    </ModalBody>
  </VueFinalModal>
</template>
