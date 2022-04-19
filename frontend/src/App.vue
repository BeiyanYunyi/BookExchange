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
import { RouterView } from 'vue-router';
import AppContainer from './components/AppContainer.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import NaiveContainer from './components/NaiveContainer.vue';
</script>
