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
        {{ user.college }}
      </NDescriptionsItem>
      <NDescriptionsItem label="班级">
        {{ user.class }}
      </NDescriptionsItem>
      <NDescriptionsItem label="已预定 / 已捐出">
        {{ user.orderedBooks }} 本 / {{ user.committedBooks }} 本
      </NDescriptionsItem>
    </NDescriptions>
    <NSpace v-if="user.role === 1" justify="center" style="margin-top: 0.5rem">
      <NALink to="/admin/user">管理用户</NALink>
    </NSpace>
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
import ky from 'ky';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import NALink from '../components/NALink.vue';
import UserAvatar from '../components/UserAvatar.vue';
import axiosClient from '../service/axiosClient';
import useAuthStore from '../stores/authState';

const router = useRouter();
const authState = useAuthStore();
const { user } = storeToRefs(authState);
const handleLogoutConfirm = async () => {
  authState.$patch({ authed: false });
  localStorage.removeItem('authToken');
  axiosClient.changeClient(ky.create({}));
  router.replace('/');
};
</script>

<style module>
.name {
  text-align: center;
}
</style>
