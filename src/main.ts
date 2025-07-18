import { createApp } from 'vue'
import './assets/styles/tailwind.css';
import App from './App.vue'
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Importa los estilos de Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import router from './router'; // ⚠️ importa el router
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoCash } from "oh-vue-icons/icons";
addIcons(CoCash);


const vuetify = createVuetify();
const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.use(vuetify).use(router); // Usa Vuetify en la app
app.mount('#app');