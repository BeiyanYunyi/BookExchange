import axios, { AxiosInstance } from 'axios';
import IUserMe from '../../../types/IUserMe';

/** 保存一个 Axios 实例，方便用户验证 */
class AxiosClient {
  client = axios.create();

  changeClient(newInst: AxiosInstance) {
    this.client = newInst;
  }

  private async validate(): Promise<false | IUserMe> {
    const token = localStorage.getItem('authToken');
    if (!token) return Promise.resolve(false);
    const newClient = axios.create({ headers: { Authorization: `Bearer ${token}` } });
    const res = await newClient.get<IUserMe>('/api/user/me', {
      validateStatus: (status) => status < 500,
    });
    if (res.status !== 200) {
      localStorage.removeItem('authToken');
      return Promise.resolve(false);
    }
    this.client = newClient;
    return Promise.resolve(res.data);
  }

  async login(password?: string, stuNum?: string) {
    if (password && stuNum) {
      const res = await axios.post(
        '/api/auth/login',
        { password, stuNum },
        { validateStatus: () => true },
      );
      if (res.status >= 300) {
        return false;
      }
      localStorage.setItem('authToken', res.data.token);
    }
    return this.validate();
  }
}

const axiosClient = new AxiosClient();

export default axiosClient;
