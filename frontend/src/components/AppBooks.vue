<template>
  <AddBookModel ref="addBookModelRef" />
  <AppBook ref="appBookModelRef" />
  <NSpace vertical justify="center" style="min-height: 70vh">
    <NSpace justify="center">
      <NButton
        dashed
        @click="authState.authed ? addBookModelRef?.open() : message.error('请先登录')"
      >
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
    <NScrollbar x-scrollable style="max-width: 100vw">
      <NDataTable
        :columns="columns"
        :data="displayAll ? booksState.shuffled : booksState.orderable"
        :row-key="(row) => row.id"
        :row-props="rowProps"
      >
        <template #empty>
          <NEmpty size="huge">
            列表为空
            <template #extra>
              <NButton type="tertiary" @click="booksState.refresh()">刷新试试</NButton>
            </template>
          </NEmpty>
        </template>
      </NDataTable>
    </NScrollbar>
  </NSpace>
</template>
<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5';
import {
  DataTableColumns,
  NButton,
  NDataTable,
  NEmpty,
  NIcon,
  NScrollbar,
  NSpace,
  NTag,
  useMessage,
} from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import IFrontendBook from '../../../types/IFrontendBook';
import useAuthStore from '../stores/authState';
import useBooksStore from '../stores/booksState';
import getStatus from '../utils/getStatus';
import AddBookModel from './AddBookModel.vue';
import AppBook from './AppBook.vue';

const message = useMessage();
const authState = useAuthStore();
const booksState = useBooksStore();
const addBookModelRef = ref<InstanceType<typeof AddBookModel> | null>(null);
const appBookModelRef = ref<InstanceType<typeof AppBook> | null>(null);
const displayAll = ref(true);

const createColumns = (): DataTableColumns<IFrontendBook> => [
  { title: '标题', key: 'title' },
  { title: '作者', key: 'author', ellipsis: true },
  {
    title: '标签',
    key: 'tags',
    render: (row) => h(NSpace, () => row.tags.map((tagKey) => h(NTag, () => tagKey))),
    ellipsis: true,
  },
  {
    title: '状态',
    key: 'status',
    render: (row) => getStatus(row),
    ellipsis: true,
  },
];
const columns = createColumns();
const rowProps = (row: any) => ({
  onClick: () => {
    appBookModelRef.value?.popInfo(row);
  },
  style: 'cursor: pointer',
});

onMounted(() => booksState.refresh());
</script>
