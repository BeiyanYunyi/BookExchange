<template>
  <AddBookModel ref="addBookModelRef" />
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
        {{ displayAll ? '点击只显示可预定' : '点击显示所有书本' }}
      </NButton>
    </NSpace>
    <AppBook
      v-for="book in displayAll ? bookInfo : booksState.orderable"
      :key="book.id"
      :info="book"
    />
    <NEmpty v-if="(displayAll ? bookInfo : booksState.orderable).length === 0" size="huge">
      列表为空
      <template #extra>
        <NButton type="tertiary" @click="booksState.refresh()">刷新试试</NButton>
      </template>
    </NEmpty>
  </NSpace>
</template>
<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5';
import { NButton, NEmpty, NIcon, NSpace } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import useBooksStore from '../stores/booksState';
import AddBookModel from './AddBookModel.vue';
import AppBook from './AppBook.vue';

const booksState = useBooksStore();
const { books: bookInfo } = storeToRefs(booksState);
const addBookModelRef = ref<InstanceType<typeof AddBookModel> | null>(null);
const displayAll = ref(false);

onMounted(() => booksState.refresh());
</script>
