<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

// Open from the very first render, which is the only situation where Vue's
// `appear` phase could ever run.
const show = ref(true)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    :content-transition="{
      name: 'vfm-fade',
      appearFromClass: 'lab-appear--from',
      appearActiveClass: 'lab-appear--active',
    }"
  >
    <ModalBody heading="appear vs enter" @close="show = false">
      <p>
        The library forces <code>appear: true</code>, but the content element is not part of the
        first render, so what actually runs is the regular <em>enter</em> transition.
      </p>
    </ModalBody>
  </VueFinalModal>
</template>
