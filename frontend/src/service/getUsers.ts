import IUserMe from '../../../types/IUserMe';
import axiosClient from './axiosClient';

const getUsers = async () => {
  const res = await axiosClient.client.get<IUserMe[]>('/api/user');
  return res.data;
};

export default getUsers;
