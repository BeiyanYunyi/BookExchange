<template>
  <NCard :bordered="false" content-style="padding: 0;" :class="$style.card">
    <NPageHeader :class="$style.header">
      <template #title>
        <div :class="$style.title" @click="router.push('/')">阅读益行</div>
      </template>
      <template #avatar>
        <UserAvatar circle src="/头像圆.png" :class="$style.avatar" @click="router.push('/me')" />
      </template>
    </NPageHeader>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NPageHeader, useLoadingBar } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import useLoadingStore from '../stores/loadingState';
import UserAvatar from './UserAvatar.vue';

const loadingBar = useLoadingBar();
const router = useRouter();
const loadingState = useLoadingStore();
const { loading } = storeToRefs(loadingState);

watch(loading, (newLoading, oldLoading) => {
  if (newLoading) {
    loadingBar.start();
  } else if (oldLoading) {
    loadingBar.finish();
  }
});
</script>

<style module>
.header {
  padding: 1rem;
}
.card {
  position: sticky;
  top: 0;
  margin-bottom: 0.5rem;
  z-index: 2;
  border-bottom: 1px solid var(--n-border-color);
}

.avatar {
  cursor: pointer;
}
.title {
  cursor: pointer;
}
</style>
