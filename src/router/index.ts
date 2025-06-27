// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Begin from '../components/tipPage.vue';
import NewPage from '../pages/testPage.vue';
import Home from '../pages/HomePage.vue';
const routes = [
  { path: '/', name: 'Begin', component: Begin },
  { path: '/nueva', name: 'Nueva', component: NewPage }, // ⚠️ ruta nueva
  { path: '/home', name: 'Home', component: Home }, // ⚠️ ruta nueva
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
