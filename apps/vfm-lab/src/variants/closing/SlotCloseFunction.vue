<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>

  <VueFinalModal v-bind="$attrs" v-model="show">
    <template #default="{ close }">
      <div class="lab-modal" data-testid="content">
        <h2>Slot close()</h2>
        <p>The default slot receives a <code>close</code> function.</p>
        <button data-testid="slot-close" type="button" @click="close()">Close via slot</button>
      </div>
    </template>
  </VueFinalModal>
</template>
