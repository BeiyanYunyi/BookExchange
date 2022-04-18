<template>
  <NaiveContainer>
    <AppHeader />
    <AppContainer>
      <RouterView />
    </AppContainer>
    <AppFooter />
  </NaiveContainer>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppContainer from './components/AppContainer.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import NaiveContainer from './components/NaiveContainer.vue';
import axiosClient from './service/axiosClient';
import useAuthStore from './stores/authState';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onBeforeMount(async () => {
  const res = await axiosClient.login();
  if (!res) {
    router.replace({ path: '/login', query: { redirect: route.fullPath } });
  } else {
    authStore.$patch({ user: res, authed: true });
  }
});
</script>
