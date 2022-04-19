import { useMessage } from 'naive-ui';
import IFrontendBook from '../../../types/IFrontendBook';
import axiosClient from './axiosClient';

const getBooks = async () => {
  const message = useMessage();
  try {
    const res = await axiosClient.client.get<IFrontendBook[]>('/api/book');
    return res.data;
  } catch (e) {
    message.error('获取书本列表失败');
    console.error(e);
    return [];
  }
};

export default getBooks;
