<template>
  <n-config-provider :theme="osThemeRef === 'dark' ? darkTheme : lightTheme">
    <NGlobalStyle />
    <AppHeader />
    <AppContainer>
      <RouterView />
    </AppContainer>
    <AppFooter />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme, NConfigProvider, NGlobalStyle, useOsTheme } from 'naive-ui';
import { RouterView } from 'vue-router';
import AppContainer from './components/AppContainer.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const osThemeRef = useOsTheme();
</script>
