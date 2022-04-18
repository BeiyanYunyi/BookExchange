<template>
  <AppBooks :books="bookInfo" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import IFrontendBook from '../../../types/IFrontendBook';
import AppBooks from '../components/AppBooks.vue';
import getBooks from '../service/getBooks';

const bookInfo = ref<IFrontendBook[]>([]);
onMounted(async () => {
  bookInfo.value = await getBooks();
});
</script>
