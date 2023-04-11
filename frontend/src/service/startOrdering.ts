import axiosClient from './axiosClient';

interface IStartOrderingResult {
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
  const res = await axiosClient.client.post<IStartOrderingResult>('/api/book/startOrdering');
  return res.data;
};

export default startOrdering;
