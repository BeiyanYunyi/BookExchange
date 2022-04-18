import { createPinia } from 'pinia';
import { createApp } from 'vue';
import {
  createRouter,
  createWebHistory,
  NavigationGuardWithThis,
  RouteRecordRaw,
} from 'vue-router';
import App from './App.vue';
import HomePage from './pages/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import MyInfoPage from './pages/MyInfoPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import axiosClient from './service/axiosClient';
import useAuthStore from './stores/authState';
import useInitStore from './stores/initState';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

const requireAuth: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const authState = useAuthStore();
  if (!authState.authed) return next({ path: '/login', query: { redirect: to.fullPath } });
  return next();
};

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage },
  { path: '/me', component: MyInfoPage, beforeEnter: requireAuth },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
];

const router = createRouter({ history: createWebHistory(), routes });

const authState = useAuthStore();
const initState = useInitStore();

axiosClient
  .login()
  .then((res) => {
    if (res) {
      authState.$patch({ user: res, authed: true });
    }
    initState.$patch({ ready: true });
  })
  .then(() => {
    app.use(router);
    app.mount('#app');
  });
