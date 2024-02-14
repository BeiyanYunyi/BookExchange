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
      const res = await axiosClient.client
        .put(`/api/book/${book.id}`, {
          json: {
            status: book.status === 1 ? 2 : 1,
            orderBy: book.status === 1 ? authState.user.id : null,
          },
        })
        .json<IFrontendBook>();
      loadingState.loading = false;
      return res;
    } catch (e) {
      loadingState.loading = false;
      console.error(e);
      return false;
    }
  }
  try {
    loadingState.loading = true;
    const res = await axiosClient.client.patch(`/api/book/${book.id}`).json<IFrontendBook>();
    loadingState.loading = false;
    return res;
  } catch (e) {
    loadingState.loading = false;
    console.error(e);
    return false;
  }
};

export default orderBook;
