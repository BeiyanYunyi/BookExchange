import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const putBook = async (id: string, book: Partial<IFrontendBook>) => {
  const res = await axiosClient.client.put<IFrontendBook>(`/api/book/${id}`, book);
  return res.data;
};

export default putBook;
