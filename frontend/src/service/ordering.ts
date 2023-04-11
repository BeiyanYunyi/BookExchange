import axiosClient from './axiosClient';

interface IOrderingResult {
  result: {
    acknowledged: true;
    modifiedCount: number;
    upsertedId: null;
    upsertedCount: number;
    matchedCount: number;
  };
  books: string[];
}

const startOrdering = async () => {
  const res = await axiosClient.client.post<IOrderingResult>('/api/book/ordering');
  return res.data;
};

export const stopOrdering = async () => {
  const res = await axiosClient.client.delete<IOrderingResult>('/api/book/ordering');
  return res.data;
};

export default startOrdering;
