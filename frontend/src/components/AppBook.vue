<template>
  <NCard hoverable>
    <NThing content-indented>
      <template #header>{{ info.title }}</template>
      <template #avatar>
        <NImage
          :width="imgWidth"
          :src="info.img || '/defaultBook.png'"
          :preview-disabled="!info.img"
        />
      </template>
      <template #description>{{ info.author }}</template>
      {{ info.desc }}
      <template #footer>
        <NSpace>
          <NButton
            v-for="(tag, index) in info.tags"
            :key="info.id + index.toString()"
            round
            secondary
            size="small"
          >
            {{ tag }}
          </NButton>
        </NSpace>
      </template>
      <template #action>由 {{ info.owner.name }} 分享，状态：{{ bookStatus }}</template>
    </NThing>
  </NCard>
</template>
<script setup lang="ts">
import { NButton, NCard, NImage, NSpace, NThing } from 'naive-ui';
import IFrontendBook from '../../../types/IFrontendBook';

const imgWidth = window.innerWidth * 0.08 < 50 ? 50 : window.innerWidth * 0.08;

const props = defineProps<{ info: IFrontendBook }>();

const bookStatus = (() => {
  switch (props.info.status) {
    case 0:
      return '待确认';
    case 2:
      return '已预定';
    case 3:
      return '已借出';
    case 4:
      return '已丢失';
    default:
      return '可借阅';
  }
})();
</script>
