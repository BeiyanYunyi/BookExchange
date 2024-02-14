import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const receiveBook = async (bookID: string) => {
  const res = await axiosClient.client.get(`/api/book/${bookID}`).json<IFrontendBook>();
  return res;
};

export default receiveBook;
