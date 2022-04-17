<template>
  <NConfigProvider :theme="osThemeRef === 'dark' ? darkTheme : lightTheme">
    <NMessageProvider>
      <NGlobalStyle />
      <AppHeader />
      <AppContainer>
        <RouterView />
      </AppContainer>
      <AppFooter />
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NGlobalStyle,
  useOsTheme,
  NMessageProvider,
} from 'naive-ui';
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import AppContainer from './components/AppContainer.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import axiosClient from './service/axiosClient';
import useAuthStore from './stores/authState';

const authStore = useAuthStore();
const osThemeRef = useOsTheme();
const router = useRouter();

onMounted(async () => {
  const res = await axiosClient.login();
  if (!res) {
    router.replace('/login');
  } else {
    authStore.$patch({ user: res, authed: true });
  }
});
</script>
