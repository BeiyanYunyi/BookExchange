import { defineStore } from 'pinia';

const useInitStore = defineStore('init', {
  state: () => {
    const initState = {
      ready: false,
    };
    return initState;
  },
});

export default useInitStore;
