<template>
  <AppBooks :books="bookInfo" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import IFrontendBook from '../../../types/IFrontendBook';
import AppBooks from '../components/AppBooks.vue';
import getBooks from '../service/getBooks';
import useLoadingStore from '../stores/loadingState';

const bookInfo = ref<IFrontendBook[]>([]);
const loadingState = useLoadingStore();
loadingState.loading = true;
onMounted(async () => {
  bookInfo.value = await getBooks();
  loadingState.loading = false;
});
</script>
