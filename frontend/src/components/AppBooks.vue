<template>
  <NSpace vertical>
    <AppBook v-for="book in books" :key="book.id" :info="book" />
  </NSpace>
</template>
<script setup lang="ts">
import { NSpace } from 'naive-ui';
import AppBook from './AppBook.vue';
import IFrontendBook from '../../../types/IFrontendBook';

defineProps<{ books: IFrontendBook[] }>();
</script>
