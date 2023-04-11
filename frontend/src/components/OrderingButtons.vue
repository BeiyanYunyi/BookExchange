<template>
  <NSpace justify="center">
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
      这会让所有已收到（已确认）的书变成可以预订的状态，确定？
    </NPopconfirm>
    <NPopconfirm
      v-if="authState.authed && authState.user.role === 1 && booksState.haveBooksOrdering"
      positive-text="确认"
      negative-text="取消"
      @positive-click="handleStopOrdering"
    >
      <template #trigger>
        <NButton type="error">
          <template #icon>
            <NIcon>
              <AddOutline />
            </NIcon>
          </template>
          不允许预订
        </NButton>
      </template>
      这会让所有可以预订的书变回不可预订（已确认）状态，确定？
    </NPopconfirm>
  </NSpace>
</template>
<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NPopconfirm, NSpace, useMessage } from 'naive-ui';
import startOrdering, { stopOrdering } from '../service/ordering';
import useAuthStore from '../stores/authState';
import useBooksStore from '../stores/booksState';

const authState = useAuthStore();
const booksState = useBooksStore();
const message = useMessage();

const handleOrdering = async () => {
  const { result, books } = await startOrdering();
  booksState.startOrdering(books);
  message.success(`已允许 ${result.modifiedCount} 本书被预订`);
};

const handleStopOrdering = async () => {
  const { result, books } = await stopOrdering();
  booksState.stopOrdering(books);
  message.success(`已取消了 ${result.modifiedCount} 本书的可预订状态，请你别再手滑了 OK？`);
};
</script>
