<template>
  <NCard title="注册" size="huge">
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem path="stuNum" label="学号">
        <NInput v-model:value="model.stuNum" placeholder="请输入学号" />
      </NFormItem>
      <NFormItem path="password" label="密码">
        <NInput v-model:value="model.password" type="password" placeholder="请输入密码" />
      </NFormItem>
    </NForm>
    <NSpace justify="center">
      <NButton type="primary">注册</NButton>
      <NButton type="tertiary" @click="router.replace('/login')">去登录</NButton>
    </NSpace>
  </NCard>
</template>
<script setup lang="ts">
import {
  FormInst,
  FormItemRule,
  FormRules,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSpace,
} from 'naive-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface ModelType {
  stuNum: string | null;
  password: string | null;
}

const router = useRouter();
const formRef = ref<FormInst | null>();
const model = ref<ModelType>({ stuNum: null, password: null });
const rules: FormRules = {
  stuNum: [{ required: true, trigger: ['input', 'blur'], message: '学号不得为空' }],
  password: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator: (rule: FormItemRule, value: string) => {
        if (!value) return new Error('密码不得为空');
        if (value.length < 6) return new Error('密码不得短于6位');
        if (value.length > 32) return new Error('密码不得长于32位');
        return true;
      },
    },
  ],
};
</script>
