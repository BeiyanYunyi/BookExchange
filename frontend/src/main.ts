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

const NoAccessPage = () => import('./pages/NoAccessPage.vue');
const UserManagePage = () => import('./pages/UserManagePage.vue');

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

const requireAuth: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const authState = useAuthStore();
  if (!authState.authed) return next({ path: '/login', query: { redirect: to.fullPath } });
  return next();
};

const requireAdmin: NavigationGuardWithThis<undefined> = (to, from, next) => {
  const authState = useAuthStore();
  if (!authState.authed) return next({ path: '/login', query: { redirect: to.fullPath } });
  if (authState.user.role !== 1) return next({ path: '/noaccess' });
  return next();
};

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage },
  { path: '/me', component: MyInfoPage, beforeEnter: requireAuth },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/noaccess', component: NoAccessPage },
  { path: '/admin/user', component: UserManagePage, beforeEnter: requireAdmin },
];

const router = createRouter({ history: createWebHistory(), routes });

const authState = useAuthStore();

axiosClient
  .login()
  .then((res) => {
    if (res) {
      authState.$patch({ user: res, authed: true });
    }
  })
  .then(() => {
    app.use(router);
    app.mount('#app');
    console.log('开控制台干啥呢？\n有兴趣来 DH 玩一玩吧？\n我们会教你写全栈项目');
  });
