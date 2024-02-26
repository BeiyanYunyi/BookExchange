<template>
  <NScrollbar x-scrollable style="max-width: 100vw">
    <NDataTable :columns="columns" :data="users" scroll-x="900" />
  </NScrollbar>
</template>
<script setup lang="ts">
import { DataTableColumns, NP } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import IUserMe from '../../../types/IUserMe';
import UserAction from '../components/UserAction.vue';
import getUsers from '../service/getUsers';
import useLoadingStore from '../stores/loadingState';

const users = ref<(IUserMe & { key: string })[]>([]);
const loadingState = useLoadingStore();
const refresh = async () => {
  loadingState.loading = true;
  const res = await getUsers();
  users.value = res.map((user) => ({ ...user, key: user.id }));
  loadingState.loading = false;
};
onMounted(() => {
  refresh();
});
const createColumns = (): DataTableColumns<IUserMe & { key: string }> => [
  { title: 'id', key: 'id', ellipsis: true },
  { title: '学号', key: 'stuNum' },
  { title: '姓名', key: 'name' },
  { title: '头像', key: 'avatar' },
  { title: '学院', key: 'college' },
  { title: '班级', key: 'class' },
  {
    title: '身份',
    key: 'role',
    render: (row) => {
      if (row.role === 0) return h(NP, () => '普通用户');
      return h(NP, () => '管理员');
    },
  },
  { title: '已贡献', key: 'committedBooks' },
  { title: '已预定', key: 'orderedBooks' },
  {
    title: '操作',
    key: 'promote',
    render: (row) => h(UserAction, { row, refresh }),
  },
];
const columns = createColumns();
</script>
