import { createVfm } from '@lrochefort/vue-final-modal'
import { createApp } from 'vue'

import App from './App.vue'
import { createAppRouter } from './router'

import '@lrochefort/vue-final-modal/style.css'
import '@tempvue/ui/style.css'
import './assets/lab.css'

const vfm = createVfm()

// The lab exists to be tested: the e2e suite drives the plugin API directly.
;(window as Window & { __vfm?: unknown }).__vfm = vfm

createApp(App).use(createAppRouter()).use(vfm).mount('#app')
