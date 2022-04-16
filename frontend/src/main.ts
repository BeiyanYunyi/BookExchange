import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import HomePage from './pages/HomePage.vue';
import App from './App.vue';

const routes = [{ path: '/', component: HomePage }];

const router = createRouter({ history: createWebHistory(), routes });
createApp(App).use(router).use(createPinia()).mount('#app');
