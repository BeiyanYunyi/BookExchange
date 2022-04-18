<template>
  <NConfigProvider :theme="osThemeRef === 'dark' ? darkTheme : lightTheme">
    <NMessageProvider>
      <NGlobalStyle />
      <slot />
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

const osThemeRef = useOsTheme();
</script>
