import IUserMe from '../../../types/IUserMe';
import axiosClient from './axiosClient';

const getMe = async () => {
  const res = await axiosClient.client.get('/api/user/me').json<IUserMe>();
  return res;
};

export default getMe;
