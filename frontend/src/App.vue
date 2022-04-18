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
import { RouterView } from 'vue-router';
import AppContainer from './components/AppContainer.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import NaiveContainer from './components/NaiveContainer.vue';
import axiosClient from './service/axiosClient';
import useAuthStore from './stores/authState';

const authStore = useAuthStore();

onBeforeMount(async () => {
  const res = await axiosClient.login();
  if (res) {
    authStore.$patch({ user: res, authed: true });
  }
});
</script>
