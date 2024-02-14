import IUserMe from '../../../types/IUserMe';
import useAuthStore from '../stores/authState';
import axiosClient from './axiosClient';

export interface IRegisterInfo {
  name: string;
  password: string;
  stuNum: string;
  college: string;
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
  const res = await axiosClient.client.post('/api/user', {
    json: info,
    throwHttpErrors: false,
  });
  if (res.status > 300) return { status: 'RegisterFailed' };
  const data = await res.json<{ token: string; info: IUserMe }>();
  localStorage.setItem('authToken', data.token);
  const authState = useAuthStore();
  authState.$patch({ authed: true, user: data.info });
  const res2 = await axiosClient.login();
  if (!res2) return { status: 'LoginFailed' };
  return { status: 'success', res: res2 };
}

export default register;
