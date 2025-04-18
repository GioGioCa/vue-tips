// src/plugins/vuetify.ts
// plugins/vuetify.ts
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
    theme: {
        defaultTheme: "customTheme",
        themes: {
            customTheme: {
                dark: false, // Tema claro
                colors: {
                    background: "#FFFFFF", // Fondo blanco
                    surface: "#F5F5F5", // Color de superficie
                    primary: "#FF8C00", // Naranja para botones y acentos
                    secondary: "#424242", // Gris oscuro para contrastes
                    error: "#FF5252",
                    success: "#4CAF50",
                    customPink: "#f7c1bd",
                    customOrange: "#f37c74",
                    customOrangeSideBar: "#ed6959",
                },
            },
        },
    },
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: { mdi },
    },
});

export default vuetify;
