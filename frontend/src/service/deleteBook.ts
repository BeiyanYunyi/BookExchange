import axiosClient from './axiosClient';

const deleteBook = async (bookID: string) => {
  const res = await axiosClient.client.delete(`/api/book/${bookID}`, {
    validateStatus: () => true,
  });
  return res;
};

export default deleteBook;
