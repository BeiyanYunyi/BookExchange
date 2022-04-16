import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { createPinia } from 'pinia';
import HomePage from './pages/HomePage.vue';
import MyInfoPage from './pages/MyInfoPage.vue';
import App from './App.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage },
  { path: '/me', component: MyInfoPage },
];

const router = createRouter({ history: createWebHistory(), routes });
createApp(App).use(router).use(createPinia()).mount('#app');
