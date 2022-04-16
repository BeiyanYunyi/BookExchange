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
      <template #action>由 {{ info.owner.collage }} 的 {{ info.owner.name }} 分享</template>
    </NThing>
  </NCard>
</template>
<script setup lang="ts">
import { NButton, NCard, NImage, NSpace, NThing } from 'naive-ui';
import IFrontendBook from '../../../types/IFrontendBook';

const imgWidth = window.innerWidth * 0.08 < 50 ? 50 : window.innerWidth * 0.08;

defineProps<{ info: IFrontendBook }>();
</script>
