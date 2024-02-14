import IUserMe from '../../../types/IUserMe';
import axiosClient from './axiosClient';

const getUsers = async () => {
  const res = await axiosClient.client.get('/api/user').json<IUserMe[]>();
  return res;
};

export default getUsers;
