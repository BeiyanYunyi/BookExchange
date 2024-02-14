import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const putBook = async (id: string, book: Partial<IFrontendBook>) => {
  const res = await axiosClient.client.put(`/api/book/${id}`, { json: book }).json<IFrontendBook>();
  return res;
};

export default putBook;
