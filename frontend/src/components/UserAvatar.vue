<template>
  <NAvatar v-if="!authed" :size="size" circle :style="{ backgroundColor: 'var(--n-color-target)' }">
    登录
  </NAvatar>
  <NAvatar v-else-if="user.avatar" :size="size" circle :src="user.avatar" />
  <NAvatar v-else :size="size" circle>
    <NIcon>
      <Person />
    </NIcon>
  </NAvatar>
</template>
<script setup lang="ts">
import { Person } from '@vicons/ionicons5';
import { NAvatar, NIcon } from 'naive-ui';
import { storeToRefs } from 'pinia';
import useAuthStore from '../stores/authState';

const authState = useAuthStore();

const { user, authed } = storeToRefs(authState);

defineProps<{ size?: number }>();
</script>
<style module>
.loginAvatar {
  background-color: green;
}
</style>
