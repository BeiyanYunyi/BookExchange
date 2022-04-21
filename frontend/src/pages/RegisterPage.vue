<template>
  <NCard title="注册" size="huge">
    <NForm :model="model" :rules="rules">
      <NFormItem path="stuNum" label="学号">
        <NInput v-model:value="model.stuNum" placeholder="请输入学号" />
      </NFormItem>
      <NFormItem path="password" label="密码">
        <NInput v-model:value="model.password" type="password" placeholder="请输入密码" />
      </NFormItem>
      <NFormItem path="stuNum" label="姓名">
        <NInput v-model:value="model.name" placeholder="请输入姓名" />
      </NFormItem>
      <NFormItem path="stuNum" label="学院">
        <NInput v-model:value="model.collage" placeholder="请输入学院" />
      </NFormItem>
      <NFormItem path="stuNum" label="班级">
        <NInput v-model:value="model.class" placeholder="请输入班级" />
      </NFormItem>
      <NSpace justify="center">
        <NButton attr-type="submit" type="primary" @click="handleRegister">注册</NButton>
        <NButton attr-type="button" type="tertiary" @click="router.replace('/login')">
          去登录
        </NButton>
      </NSpace>
    </NForm>
  </NCard>
</template>
<script setup lang="ts">
import {
  FormItemRule,
  FormRules,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  useMessage,
} from 'naive-ui';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import register, { IRegisterInfo } from '../service/register';
import useAuthStore from '../stores/authState';

const router = useRouter();
const route = useRoute();
const message = useMessage();
const initState: IRegisterInfo = { name: '', password: '', stuNum: '', collage: '', class: '' };
const model = ref<IRegisterInfo>(initState);
const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator: (rule: FormItemRule, value: string) => {
        if (!value) return new Error('不得为空');
        if (value.length > 32) return new Error('不得长于32位');
        return true;
      },
    },
  ],
  stuNum: [{ required: true, trigger: ['input', 'blur'], message: '不得为空' }],
  password: [
    {
      required: true,
      trigger: ['input', 'blur'],
      validator: (rule: FormItemRule, value: string) => {
        if (!value) return new Error('不得为空');
        if (value.length < 6) return new Error('不得短于6位');
        if (value.length > 32) return new Error('不得长于32位');
        return true;
      },
    },
  ],
  collage: [{ required: true, trigger: ['input', 'blur'], message: '不得为空' }],
  class: [{ required: true, trigger: ['input', 'blur'], message: '不得为空' }],
};
const authState = useAuthStore();
const handleRegister = async () => {
  const res = await register(model.value);
  switch (res.status) {
    case 'success':
      authState.$patch({ user: res.res, authed: true });
      message.success('注册成功');
      return router.replace((route.query.redirect as string) || '/');
    case 'LoginFailed':
      return message.error('注册成功，登录失败');
    default:
      return message.error('注册失败，请检查学号是否重复');
  }
};
</script>
