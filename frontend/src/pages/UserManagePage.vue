<template><NDataTable :columns="columns" :data="users" /></template>
<script setup lang="ts">
import { DataTableColumns, NButton, NDataTable, NP } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import IUserMe from '../../../types/IUserMe';
import getUsers from '../service/getUsers';

const users = ref<(IUserMe & { key: string })[]>([]);
const createColumns = (): DataTableColumns<IUserMe> => [
  { title: 'id', key: 'id' },
  { title: '学号', key: 'stuNum' },
  { title: '姓名', key: 'name' },
  { title: '头像', key: 'avatar' },
  { title: '学院', key: 'collage' },
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
    title: '提权',
    key: 'promote',
    render: (row) => {
      if (row.role === 0) return h(NButton, { type: 'tertiary' }, () => '提权');
      return undefined;
    },
  },
];
const columns = createColumns();
const refresh = async () => {
  const res = await getUsers();
  users.value = res.map((user) => ({ ...user, key: user.id }));
};
onMounted(() => {
  refresh();
});
</script>
