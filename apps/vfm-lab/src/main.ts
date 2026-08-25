import { createVfm } from '@lrochefort/vue-final-modal'
import { createApp } from 'vue'

import App from './App.vue'
import { createAppRouter } from './router'

import '@lrochefort/vue-final-modal/style.css'
import '@tempvue/ui/style.css'
import './assets/lab.css'

createApp(App).use(createAppRouter()).use(createVfm()).mount('#app')
