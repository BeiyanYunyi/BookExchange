<template>
  <NModal v-model:show="showModel" :mask-closable="false">
    <NCard role="dialog" title="人人为我，我为人人" :class="$style.model">
      <template #header-extra>
        <NButton quaternary :class="$style.closeButton" @click="showModel = false">
          <NIcon>
            <CloseOutline />
          </NIcon>
        </NButton>
      </template>
      <NForm :model="formModel" :rules="rules">
        <NFormItem path="title" label="标题">
          <NInput v-model:value="formModel.title" placeholder="请输入标题" />
        </NFormItem>
        <NFormItem path="author" label="作者">
          <NInput v-model:value="formModel.author" placeholder="请输入作者" />
        </NFormItem>
        <NFormItem path="desc" label="简介">
          <NInput v-model:value="formModel.desc" type="textarea" placeholder="请输入简介" />
        </NFormItem>
        <NFormItem path="tags" label="标签">
          <NDynamicTags v-model:value="tags" :max="5" />
        </NFormItem>
        <NSpace justify="center">
          <NPopconfirm positive-text="确定" negative-text="取消" @positive-click="handleSubmit">
            <template #trigger>
              <NButton attr-type="submit" type="primary">提交</NButton>
            </template>
            确定提交吗？
          </NPopconfirm>
        </NSpace>
      </NForm>
    </NCard>
  </NModal>
</template>
<script setup lang="ts">
import {
  NModal,
  NIcon,
  NButton,
  NCard,
  NSpace,
  NPopconfirm,
  NForm,
  NFormItem,
  NInput,
  NDynamicTags,
  FormRules,
  useMessage,
} from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';
import { ref } from 'vue';
import addBook, { IAddBookParam } from '../service/addBook';
import useBooksStore from '../stores/booksState';
import useLoadingStore from '../stores/loadingState';

const message = useMessage();
const loadingState = useLoadingStore();
const showModel = ref(false);
const formModel = ref<IAddBookParam>({ title: '', desc: '', author: '', tags: [], img: '' });
const tags = ref<string[]>([]);
const rules: FormRules = {
  title: [{ required: true, trigger: ['input', 'blur'], message: '不得为空' }],
  desc: [{ required: true, trigger: ['input', 'blur'], message: '不得为空' }],
  author: [{ required: true, trigger: ['input', 'blur'], message: '不得为空' }],
};
const open = () => {
  showModel.value = true;
};
const bookState = useBooksStore();

defineExpose<{ open: () => void }>({ open });

const handleSubmit = async () => {
  loadingState.loading = true;
  try {
    await addBook({ ...formModel.value, tags: tags.value });
    await bookState.refresh();
    message.success('感谢您的贡献');
    showModel.value = false;
  } catch (e) {
    message.error('添加书本失败');
    console.error(e);
  }
  loadingState.loading = false;
};
</script>
<style module>
.model {
}
.closeButton {
  margin-left: 1rem;
}
</style>
