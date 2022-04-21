import IUserMe from '../../../types/IUserMe';
import axiosClient from './axiosClient';

const getMe = async () => {
  const res = await axiosClient.client.get<IUserMe>('/api/user/me');
  return res.data;
};

export default getMe;
