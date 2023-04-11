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
      <StartOrderingButton />
    </NSpace>
    <NScrollbar x-scrollable style="max-width: 100vw">
      <NDataTable
        :columns="columns"
        :data="booksState.shuffled"
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
import StartOrderingButton from './StartOrderingButton.vue';

const message = useMessage();
const authState = useAuthStore();
const booksState = useBooksStore();
const addBookModelRef = ref<InstanceType<typeof AddBookModel> | null>(null);
const appBookModelRef = ref<InstanceType<typeof AppBook> | null>(null);

const createColumns = (): DataTableColumns<IFrontendBook> => [
  {
    title: '标题',
    key: 'title',
  },
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
    defaultFilterOptionValue: 'all',
    filterMultiple: false,
    filterOptions: [
      { label: '全部', value: 'all' },
      { label: '我的预定', value: 'ordered' },
      { label: '我的贡献', value: 'donated' },
      { label: '可预定', value: 'orderable' },
    ],
    filter: (value, row) => {
      switch (value) {
        case 'all':
          return true;
        case 'ordered':
          if (!row.orderBy) return false;
          return row.orderBy.id === authState.user.id;
        case 'donated':
          return row.owner.id === authState.user.id;
        case 'orderable':
          return row.status === 1 && row.owner.id !== authState.user.id;
        default:
          return false;
      }
    },
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
