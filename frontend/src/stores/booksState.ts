import { defineStore } from 'pinia';
import IFrontendBook from '../../../types/IFrontendBook';
import getBooks from '../service/getBooks';
import useAuthStore from './authState';
import useLoadingStore from './loadingState';

const useBooksStore = defineStore('books', {
  state: () => {
    const books: IFrontendBook[] = [];
    const booksState = {
      books,
      authed: false,
    };
    return booksState;
  },
  actions: {
    async refresh() {
      const loadingState = useLoadingStore();
      loadingState.loading = true;
      this.books = await getBooks();
      loadingState.loading = false;
    },
    update(book: IFrontendBook) {
      const index = this.books.findIndex((oriBook) => oriBook.id === book.id);
      this.books[index] = book;
    },
  },
  getters: {
    orderable(state) {
      const authState = useAuthStore();
      return state.books.filter((book) => book.status === 1 && book.owner.id !== authState.user.id);
    },
  },
});

export default useBooksStore;
