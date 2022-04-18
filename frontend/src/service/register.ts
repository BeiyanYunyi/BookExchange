import IUserMe from '../../../types/IUserMe';
import useAuthStore from '../stores/authState';
import axiosClient from './axiosClient';

export interface IRegisterInfo {
  name: string;
  password: string;
  stuNum: string;
  collage: string;
  class: string;
}

type RegisterResult =
  | {
      status: 'success';
      res: IUserMe;
    }
  | { status: 'LoginFailed' }
  | { status: 'RegisterFailed' };

async function register(info: IRegisterInfo): Promise<RegisterResult> {
  const res = await axiosClient.client.post<{ token: string; info: IUserMe }>('/api/user', info, {
    validateStatus: () => true,
  });
  if (res.status > 300) return { status: 'RegisterFailed' };
  localStorage.setItem('authToken', res.data.token);
  const authState = useAuthStore();
  authState.$patch({ authed: true, user: res.data.info });
  const res2 = await axiosClient.login();
  if (!res2) return { status: 'LoginFailed' };
  return { status: 'success', res: res2 };
}

export default register;
