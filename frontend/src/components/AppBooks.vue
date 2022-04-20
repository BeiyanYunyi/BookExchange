<template>
  <AddBookModel ref="addBookModelRef" :refresh="refresh" />
  <NSpace vertical justify="center" style="min-height: 70vh">
    <NSpace justify="center">
      <NButton dashed @click="addBookModelRef?.open()">
        <template #icon>
          <NIcon>
            <AddOutline />
          </NIcon>
        </template>
        贡献书本
      </NButton>
      <NButton :type="displayAll ? 'primary' : 'tertiary'" @click="displayAll = !displayAll">
        {{ displayAll ? '点击只显示可领取' : '点击显示所有书本' }}
      </NButton>
    </NSpace>
    <AppBook
      v-for="book in displayAll ? bookInfo : bookInfo.filter((book) => book.status === 1)"
      :key="book.id"
      :info="book"
    />
    <NEmpty
      v-if="(displayAll ? bookInfo : bookInfo.filter((book) => book.status === 1)).length === 0"
      size="huge"
    >
      列表为空
      <template #extra>
        <NButton type="tertiary" @click="refresh">刷新试试</NButton>
      </template>
    </NEmpty>
  </NSpace>
</template>
<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5';
import { NButton, NEmpty, NIcon, NSpace } from 'naive-ui';
import { onMounted, ref } from 'vue';
import IFrontendBook from '../../../types/IFrontendBook';
import getBooks from '../service/getBooks';
import AddBookModel from './AddBookModel.vue';
import useLoadingStore from '../stores/loadingState';
import AppBook from './AppBook.vue';

const bookInfo = ref<IFrontendBook[]>([]);
const addBookModelRef = ref<InstanceType<typeof AddBookModel> | null>(null);
const displayAll = ref(false);
const loadingState = useLoadingStore();

const refresh = async () => {
  loadingState.loading = true;
  bookInfo.value = await getBooks();
  loadingState.loading = false;
};
onMounted(() => refresh());
</script>
