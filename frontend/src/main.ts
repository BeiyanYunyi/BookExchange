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
import useAuthStore from './stores/authState';

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

app.use(router);
app.mount('#app');
