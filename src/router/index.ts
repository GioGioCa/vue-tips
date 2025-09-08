// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Begin from '../pages/tipPage.vue';
const routes = [
  { path: '/', name: 'Begin', component: Begin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
