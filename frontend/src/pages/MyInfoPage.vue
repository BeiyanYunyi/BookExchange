<template>
  <NCard hoverable>
    <AppContainer>
      <NAvatar v-if="user.avatar" :size="128" circle :src="user.avatar" />
      <NAvatar v-else :size="128" circle>
        <NIcon>
          <Person />
        </NIcon>
      </NAvatar>
    </AppContainer>
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
    </NDescriptions>
    <template #action>
      <NSpace justify="center">
        <NButton circle type="tertiary" @click="router.back()">
          <NIcon>
            <ArrowBackOutline />
          </NIcon>
        </NButton>
        <NButton circle type="tertiary">
          <NIcon>
            <CreateOutline />
          </NIcon>
        </NButton>
        <NButton circle ghost type="error">
          <NIcon>
            <LogOutOutline />
          </NIcon>
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>
<script setup lang="ts">
import { ArrowBackOutline, CreateOutline, LogOutOutline, Person } from '@vicons/ionicons5';
import {
  NAvatar,
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NH3,
  NIcon,
  NSpace,
} from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import AppContainer from '../components/AppContainer.vue';
import useAuthStore from '../stores/authState';

const router = useRouter();
const authState = useAuthStore();
const { user } = storeToRefs(authState);
</script>

<style module>
.name {
  text-align: center;
}
</style>
