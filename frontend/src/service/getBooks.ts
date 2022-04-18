import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const getBooks = async () => {
  const res = await axiosClient.client.get<IFrontendBook[]>('/api/book');
  return res.data;
};

export default getBooks;
