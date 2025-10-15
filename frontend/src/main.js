/* eslint-disable vue/multi-word-component-names */

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import PrimeVue from 'primevue/config'
import Galleria from 'primevue/galleria'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(PrimeVue)

app.component('Galleria', Galleria)

app.mount('#app')
