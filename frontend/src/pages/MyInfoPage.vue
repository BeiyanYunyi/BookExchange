<template>
  <NCard hoverable size="huge">
    <NSpace justify="center">
      <UserAvatar :size="128" />
    </NSpace>
    <NH3 align-text :class="$style.name">{{ user.name }}</NH3>
    <NDescriptions :column="1" label-placement="left">
      <NDescriptionsItem label="学号">
        {{ user.stuNum }}
      </NDescriptionsItem>
      <NDescriptionsItem label="学院">
        {{ user.collage }}
      </NDescriptionsItem>
      <NDescriptionsItem label="班级">
        {{ user.class }}
      </NDescriptionsItem>
      <NDescriptionsItem label="已预定 / 已贡献">
        {{ user.orderedBooks }} 本 / {{ user.committedBooks }} 本
      </NDescriptionsItem>
    </NDescriptions>
    <template #action>
      <NSpace justify="center">
        <NButton circle type="tertiary" @click="router.push('/')">
          <NIcon>
            <HomeOutline />
          </NIcon>
        </NButton>
        <NButton circle type="tertiary">
          <NIcon>
            <CreateOutline />
          </NIcon>
        </NButton>
        <NPopconfirm
          positive-text="确认"
          negative-text="取消"
          :positive-button-props="{ type: 'warning' }"
          :negative-button-props="{ type: 'tertiary' }"
          @positive-click="handleLogoutConfirm"
        >
          <template #trigger>
            <NButton circle ghost type="error">
              <NIcon>
                <LogOutOutline />
              </NIcon>
            </NButton>
          </template>
          确认退出登录吗？
        </NPopconfirm>
      </NSpace>
    </template>
  </NCard>
</template>
<script setup lang="ts">
import { CreateOutline, HomeOutline, LogOutOutline } from '@vicons/ionicons5';
import axios from 'axios';
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NH3,
  NIcon,
  NPopconfirm,
  NSpace,
} from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import UserAvatar from '../components/UserAvatar.vue';
import axiosClient from '../service/axiosClient';
import useAuthStore from '../stores/authState';

const router = useRouter();
const authState = useAuthStore();
const { user } = storeToRefs(authState);
const handleLogoutConfirm = async () => {
  authState.$patch({ authed: false });
  localStorage.removeItem('authToken');
  axiosClient.changeClient(axios.create());
  router.replace('/');
};
</script>

<style module>
.name {
  text-align: center;
}
</style>
