<script setup lang="ts">
import { VueFinalModal } from '@lrochefort/vue-final-modal'
import { ref } from 'vue'

import ModalBody from '@/components/ModalBody.vue'

defineOptions({ inheritAttrs: false })

const show = ref(false)
const events = ref<string[]>([])

function record(name: string): void {
  events.value.push(name)
}
</script>

<template>
  <button data-testid="trigger" type="button" @click="show = true">Open</button>
  <button data-testid="close" type="button" @click="show = false">Close</button>
  <button data-testid="reset" type="button" @click="events = []">Reset log</button>

  <ol data-testid="events">
    <li v-for="(event, index) in events" :key="`${event}-${index}`" data-testid="event">
      {{ event }}
    </li>
  </ol>

  <VueFinalModal
    v-bind="$attrs"
    v-model="show"
    @before-open="record('beforeOpen')"
    @opened="record('opened')"
    @before-close="record('beforeClose')"
    @closed="record('closed')"
    @click-outside="record('clickOutside')"
  >
    <ModalBody heading="Lifecycle emit order" @close="show = false">
      <p>Every lifecycle emit is appended to the log above, in order.</p>
    </ModalBody>
  </VueFinalModal>
</template>
