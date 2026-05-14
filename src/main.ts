import 'leaflet/dist/leaflet.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Theme vor dem ersten Render initialisieren — verhindert Theme-Flash (FOUC)
useThemeStore(pinia).init()

app.mount('#app')
