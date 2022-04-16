<template>
  <n-config-provider :theme="osThemeRef === 'dark' ? darkTheme : lightTheme">
    <NGlobalStyle />
    <AppHeader />
    <RouterView />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme, NConfigProvider, NGlobalStyle, useOsTheme } from 'naive-ui';
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';

const osThemeRef = useOsTheme();
</script>
