import { createVfm } from '@lrochefort/vue-final-modal'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router/index.ts'

import '@lrochefort/vue-final-modal/style.css'
import '@tempvue/ui/style.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVfm())

app.mount('#app')
