<template>
  <NConfigProvider :theme="osThemeRef === 'dark' ? darkTheme : lightTheme">
    <NMessageProvider>
      <NLoadingBarProvider>
        <NGlobalStyle />
        <slot />
      </NLoadingBarProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
<script setup lang="ts">
import { darkTheme, lightTheme, NGlobalStyle, useOsTheme } from 'naive-ui';

const osThemeRef = useOsTheme();
</script>
