<template>
  <NResult status="403" title="403 无权限" style="min-height: 70vh">
    <NP :class="$style.center">我们捂住了你的耳和眼</NP>
    <NP :class="$style.center">就像俄乌、上海和丰县</NP>
    <NP :class="$style.center">但这是为了数据的安全</NP>
    <NP :class="$style.center">而非如他们般遮遮掩掩</NP>
    <template #footer>
      <NButton @click="router.back()">返回</NButton>
    </template>
  </NResult>
</template>
<script setup lang="ts">
import { NResult, NButton, NP } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<style module>
.center {
  text-align: center;
}
</style>
