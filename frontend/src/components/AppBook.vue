<template>
  <NModal v-model:show="showModel" @close="hideInfo">
    <NCard hoverable :class="$style.card">
      <NThing content-indented>
        <template #header>
          <NP :class="[$style.max70vw, $style.title]">
            {{ info.title }}
          </NP>
        </template>
        <template #avatar>
          <NImage
            :width="imgWidth"
            :src="info.img || '/defaultBook.png'"
            :preview-disabled="!info.img"
          />
        </template>
        <template #description>{{ info.author }}</template>
        <NP :class="$style.max70vw">
          {{ info.desc }}
        </NP>
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
          <NP :class="$style.max70vw">
            由 {{ info.owner.name }} 分享，状态：{{ bookStatus
            }}{{ info.orderBy ? `（预定者：${info.orderBy.name}）` : '' }}
          </NP>
        </template>
      </NThing>
      <template #action>
        <NSpace>
          <NButton type="error" @click="hideInfo">关闭</NButton>
          <NPopconfirm
            v-if="
              (info.status === 1 && info.owner.id !== authState.user.id) ||
              (info.status === 2 && info.orderBy)
            "
            positive-text="确认"
            negative-text="取消"
            @positive-click="handlePatch"
          >
            <template #trigger>
              <NButton
                v-if="info.status === 1 && info.owner.id !== authState.user.id"
                type="primary"
              >
                预定
                <template #icon>
                  <NIcon>
                    <CheckmarkDoneOutline />
                  </NIcon>
                </template>
              </NButton>
              <NButton v-if="info.status === 2 && info.orderBy" type="warning">
                取消预定
                <template #icon>
                  <NIcon>
                    <ReturnUpBackOutline />
                  </NIcon>
                </template>
              </NButton>
            </template>
            确定？
          </NPopconfirm>
        </NSpace>
      </template>
    </NCard>
  </NModal>
</template>
<script setup lang="ts">
import { CheckmarkDoneOutline, ReturnUpBackOutline } from '@vicons/ionicons5';
import {
  NButton,
  NCard,
  NIcon,
  NImage,
  NSpace,
  NThing,
  NPopconfirm,
  useMessage,
  NModal,
  NP,
} from 'naive-ui';
import { ref, watch } from 'vue';
import IFrontendBook from '../../../types/IFrontendBook';
import getMe from '../service/getMe';
import orderBook from '../service/orderBook';
import useAuthStore from '../stores/authState';
import useBooksStore from '../stores/booksState';

const imgWidth = window.innerWidth * 0.08 < 50 ? 50 : window.innerWidth * 0.08;
const initInfo: IFrontendBook = {
  id: '',
  desc: '',
  title: '',
  author: '',
  owner: { id: '', name: '', avatar: null },
  tags: [],
  img: '',
  status: 1,
};
const info = ref(initInfo);
const authState = useAuthStore();
const bookState = useBooksStore();
const message = useMessage();
const getStatus = () => {
  switch (info.value.status) {
    case 0:
      return '待确认';
    case 2:
      return '已预定';
    case 3:
      return '已借出';
    case 4:
      return '已丢失';
    default:
      if (info.value.owner.id !== authState.user.id) return '可预定';
      return '等待预定';
  }
};
const bookStatus = ref(getStatus());
watch(info, () => {
  bookStatus.value = getStatus();
});
const handlePatch = async () => {
  if (!authState.authed) return message.error('请先登录');
  const res = await orderBook(info.value);
  if (!res) return message.error('操作失败');
  const me = await getMe();
  authState.$patch({ user: me });
  if (res.orderBy) {
    message.success(`预定成功，还可预定 ${me.committedBooks - me.orderedBooks} 本`);
  } else {
    message.warning(`取消成功，还可预定 ${me.committedBooks - me.orderedBooks} 本`);
  }
  return bookState.update(res);
};
const showModel = ref(false);
const hideInfo = () => {
  showModel.value = false;
};
const popInfo = (newInfo: IFrontendBook) => {
  info.value = newInfo;
  showModel.value = true;
};
defineExpose({ popInfo, hideInfo });
</script>
<style module>
.max70vw {
  max-width: 70vw;
  word-break: break-all;
}
.title {
  font-size: 16px;
}
.card {
  max-width: 80rem;
}
</style>
