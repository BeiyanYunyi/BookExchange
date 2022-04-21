<template>
  <NPopconfirm
    v-if="row.role !== 1"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePromotion"
  >
    <template #trigger>
      <NButton text>
        <NIcon><ChevronUp /></NIcon>
      </NButton>
    </template>
    确定设为管理员？
  </NPopconfirm>
</template>
<script setup lang="ts">
import { ChevronUp } from '@vicons/ionicons5';
import { NButton, NIcon, NPopconfirm } from 'naive-ui';
import IUserMe from '../../../types/IUserMe';
import promoteUser from '../service/promoteUser';
import useLoadingStore from '../stores/loadingState';

const props = defineProps<{ row: IUserMe & { key: string }; refresh: () => Promise<void> }>();

const loadingState = useLoadingStore();
const handlePromotion = async () => {
  loadingState.loading = true;
  await promoteUser(props.row.id);
  loadingState.loading = false;
  props.refresh();
};
</script>
