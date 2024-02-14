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
  const res = await axiosClient.client.post('/api/book/ordering').json<IOrderingResult>();
  return res;
};

export const stopOrdering = async () => {
  const res = await axiosClient.client.delete('/api/book/ordering').json<IOrderingResult>();
  return res;
};

export default startOrdering;
