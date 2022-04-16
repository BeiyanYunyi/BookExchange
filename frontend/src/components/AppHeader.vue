<template>
  <NCard :bordered="false" content-style="padding: 0;" :class="$style.card">
    <NPageHeader :class="$style.header">
      <template #title>
        <div :class="$style.title" @click="router.push('/')">阅读益行</div>
      </template>
      <template #avatar>
        <NAvatar circle src="/头像圆.png" :class="$style.avatar" @click="router.push('/me')" />
      </template>
    </NPageHeader>
  </NCard>
</template>

<script setup lang="ts">
import { NPageHeader, NAvatar, NCard } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style module>
.header {
  padding: 1rem;
}
.card {
  position: sticky;
  top: 0;
  margin-bottom: 0.5rem;
  z-index: 1;
  border-bottom: 1px solid var(--n-border-color);
}

.avatar {
  cursor: pointer;
}
.title {
  cursor: pointer;
}
</style>
