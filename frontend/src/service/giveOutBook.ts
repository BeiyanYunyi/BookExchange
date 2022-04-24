import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const giveOutBook = async (bookID: string) => {
  const res = await axiosClient.client.get<IFrontendBook>(`/api/book/${bookID}/receive`);
  return res.data;
};

export default giveOutBook;
