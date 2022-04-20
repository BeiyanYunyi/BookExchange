import IFrontendBook from '../../../types/IFrontendBook';
import useAuthStore from '../stores/authState';
import useLoadingStore from '../stores/loadingState';
import axiosClient from './axiosClient';

const orderBook = async (book: IFrontendBook) => {
  const loadingState = useLoadingStore();
  const authState = useAuthStore();
  if (authState.user.role === 1) {
    try {
      loadingState.loading = true;
      const res = await axiosClient.client.put<IFrontendBook>(`/api/book/${book.id}`, {
        status: book.status === 1 ? 2 : 1,
        orderBy: book.status === 1 ? authState.user.id : null,
      });
      loadingState.loading = false;
      return res.data;
    } catch (e) {
      loadingState.loading = false;
      console.error(e);
      return false;
    }
  }
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
