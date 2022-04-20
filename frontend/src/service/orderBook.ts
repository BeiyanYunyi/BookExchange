import IFrontendBook from '../../../types/IFrontendBook';
import useLoadingStore from '../stores/loadingState';
import axiosClient from './axiosClient';

const orderBook = async (book: IFrontendBook) => {
  const loadingState = useLoadingStore();
  try {
    loadingState.loading = true;
    const res = await axiosClient.client.patch<IFrontendBook>(`/api/book/${book.id}`);
    loadingState.loading = false;
    return res.data;
  } catch (e) {
    loadingState.loading = false;
    console.error(e);
    return false;
  }
};

export default orderBook;
