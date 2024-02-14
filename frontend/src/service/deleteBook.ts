import axiosClient from './axiosClient';

const deleteBook = async (bookID: string) => {
  const res = await axiosClient.client.delete(`/api/book/${bookID}`, {
    throwHttpErrors: false,
  });
  return res;
};

export default deleteBook;
