import { defineStore } from 'pinia';
import IUserMe from '../../../types/IUserMe';

const useAuthStore = defineStore('auth', {
  state: () => {
    const user: IUserMe = {
      stuNum: '',
      role: 0,
      college: '',
      class: '',
      id: '',
      name: '',
      avatar: null,
      orderedBooks: 0,
      committedBooks: 0,
    };
    const authState = {
      user,
      authed: false,
    };
    return authState;
  },
});

export default useAuthStore;
