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
import {
  NCard,
  NH3,
  NAvatar,
  NIcon,
  NDescriptions,
  NDescriptionsItem,
  NSpace,
  NButton,
} from 'naive-ui';
import { useRouter } from 'vue-router';
import { Person, LogOutOutline, ArrowBackOutline, CreateOutline } from '@vicons/ionicons5';
import AppContainer from '../components/AppContainer.vue';
import IUserMe from '../../../types/IUserMe';

const router = useRouter();
const user: IUserMe = {
  id: '114514',
  name: '李北群',
  stuNum: '1145141919810',
  collage: '行政楼',
  class: '89级4班',
  avatar: null,
};
</script>

<style module>
.name {
  text-align: center;
}
</style>
