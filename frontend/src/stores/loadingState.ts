import { defineStore } from 'pinia';

const useLoadingStore = defineStore('init', {
  state: () => {
    const loadingState = {
      loading: false,
    };
    return loadingState;
  },
});

export default useLoadingStore;
