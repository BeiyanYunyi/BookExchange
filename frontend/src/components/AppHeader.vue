<template>
  <NCard :bordered="false" content-style="padding: 0;" :class="$style.card">
    <NPageHeader :class="$style.header">
      <template #title>阅读益行</template>
      <template #avatar>
        <NAvatar circle src="/头像圆.png" />
      </template>
    </NPageHeader>
  </NCard>
</template>

<script setup lang="ts">
import { NPageHeader, NAvatar, NCard } from 'naive-ui';
</script>

<style module>
.header {
  padding: 1rem;
}
.card {
  position: sticky;
  top: 0;
  margin-bottom: 1rem;
  z-index: 1;
  border-bottom: 1px solid var(--n-border-color);
}
</style>
