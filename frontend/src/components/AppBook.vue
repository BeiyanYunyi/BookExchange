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
      <template #action>
        由 {{ info.owner.name }} 分享，状态：{{ bookStatus
        }}{{ info.orderBy ? `（预定者：${info.orderBy.name}）` : '' }}
      </template>
    </NThing>
    <template #action>
      <NButton
        v-if="info.status === 1 && info.owner.id !== authState.user.id"
        type="primary"
        @click="handlePatch"
      >
        预定
        <template #icon>
          <NIcon>
            <CheckmarkDoneOutline />
          </NIcon>
        </template>
      </NButton>
      <NButton v-if="info.status === 2 && info.orderBy" type="warning" @click="handlePatch">
        取消预定
        <template #icon>
          <NIcon>
            <ReturnUpBackOutline />
          </NIcon>
        </template>
      </NButton>
    </template>
  </NCard>
</template>
<script setup lang="ts">
import { CheckmarkDoneOutline, ReturnUpBackOutline } from '@vicons/ionicons5';
import { NButton, NCard, NIcon, NImage, NSpace, NThing, useMessage } from 'naive-ui';
import { ref, watch } from 'vue';
import IFrontendBook from '../../../types/IFrontendBook';
import orderBook from '../service/orderBook';
import useAuthStore from '../stores/authState';
import useBooksStore from '../stores/booksState';

const imgWidth = window.innerWidth * 0.08 < 50 ? 50 : window.innerWidth * 0.08;
const props = defineProps<{ info: IFrontendBook }>();
const authState = useAuthStore();
const bookState = useBooksStore();
const message = useMessage();
const getStatus = () => {
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
      if (props.info.owner.id !== authState.user.id) return '可预定';
      return '等待预定';
  }
};
const bookStatus = ref(getStatus());
watch(props, () => {
  bookStatus.value = getStatus();
});
const handlePatch = async () => {
  if (!authState.authed) return message.error('请先登录');
  const res = await orderBook(props.info);
  if (!res) return message.error('操作失败');
  if (res.orderBy) {
    message.success('预定成功');
  } else {
    message.warning('取消成功');
  }
  return bookState.update(res);
};
</script>
