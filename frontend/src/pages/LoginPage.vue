<template>
  <NCard title="登录" size="huge">
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem path="stuNum" label="学号">
        <NInput v-model:value="model.stuNum" placeholder="请输入学号" />
      </NFormItem>
      <NFormItem path="password" label="密码">
        <NInput v-model:value="model.password" type="password" placeholder="请输入密码" />
      </NFormItem>
      <NSpace justify="center">
        <NButton attr-type="submit" type="primary" @click="handleLogin">登录</NButton>
        <NButton type="tertiary" @click="router.replace('/register')">去注册</NButton>
      </NSpace>
    </NForm>
  </NCard>
</template>
<script setup lang="ts">
import { FormInst, FormItemRule, FormRules } from 'naive-ui';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosClient from '../service/axiosClient';
import useAuthStore from '../stores/authState';

interface ModelType {
  stuNum: string;
  password: string;
}

const message = useMessage();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const formRef = ref<FormInst | null>();
const model = ref<ModelType>({ stuNum: '', password: '' });
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
const handleLogin = async () => {
  const res = await axiosClient.login(model.value.password, model.value.stuNum);
  if (!res) return message.error('登录失败，请检查用户名或密码是否正确');
  authStore.$patch({ user: res, authed: true });
  message.success('登录成功');
  return router.replace((route.query.redirect as string) || '/');
};
</script>
