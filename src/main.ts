import { createApp } from 'vue'
import './assets/styles/tailwind.css';
import App from './App.vue'
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Importa los estilos de Vuetify


const vuetify = createVuetify();
const app = createApp(App);

app.use(vuetify); // Usa Vuetify en la app
app.mount('#app');