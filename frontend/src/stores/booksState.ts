import { defineStore } from 'pinia';
import IFrontendBook from '../../../types/IFrontendBook';
import getBooks from '../service/getBooks';
import shuffle from '../utils/shuffle';
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
    delete(bookID: string) {
      this.books = this.books.filter((book) => book.id !== bookID);
    },
    startOrdering(booksID: string[]) {
      this.books = this.books.map((book) => {
        if (booksID.includes(book.id)) {
          return { ...book, status: 1 };
        }
        return book;
      });
    },
    stopOrdering(booksID: string[]) {
      this.books = this.books.map((book) => {
        if (booksID.includes(book.id)) {
          return { ...book, status: 0 };
        }
        return book;
      });
    },
  },
  getters: {
    shuffled(state) {
      return shuffle(state.books);
    },
    haveBooksOrdering(state) {
      return !!state.books.find((book) => book.status === 1);
    },
  },
});

export default useBooksStore;
