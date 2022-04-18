import { defineStore } from 'pinia';
import IUserMe from '../../../types/IUserMe';

const useAuthStore = defineStore('auth', {
  state: () => {
    const user: IUserMe = {
      stuNum: '',
      role: 0,
      collage: '',
      class: '',
      id: '',
      name: '',
      avatar: null,
    };
    const authState = {
      user,
      authed: false,
    };
    return authState;
  },
});

export default useAuthStore;
