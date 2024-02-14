import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const giveOutBook = async (bookID: string) => {
  const res = await axiosClient.client.get(`/api/book/${bookID}/receive`).json<IFrontendBook>();
  return res;
};

export default giveOutBook;
