<template>
  <NPopconfirm
    v-if="authState.authed && authState.user.role === 1"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleOrdering"
  >
    <template #trigger>
      <NButton type="error">
        <template #icon>
          <NIcon>
            <AddOutline />
          </NIcon>
        </template>
        允许预订
      </NButton>
    </template>
    这会让所有已收到的书变成可以预订的状态，确定？
  </NPopconfirm>
</template>
<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NPopconfirm } from 'naive-ui';
import startOrdering from '../service/startOrdering';
import useAuthStore from '../stores/authState';
import useBooksStore from '../stores/booksState';

const authState = useAuthStore();
const booksState = useBooksStore();

const handleOrdering = async () => {
  const { result, books } = await startOrdering();
  console.log(result);
  booksState.startOrdering(books);
};
</script>
