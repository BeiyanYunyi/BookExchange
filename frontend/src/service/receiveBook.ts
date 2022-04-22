import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const receiveBook = async (bookID: string) => {
  const res = await axiosClient.client.get<IFrontendBook>(`/api/book/${bookID}`);
  return res.data;
};

export default receiveBook;
