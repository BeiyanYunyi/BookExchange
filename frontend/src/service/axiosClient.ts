import ky, { KyInstance } from 'ky';
import IUserMe from '../../../types/IUserMe';

/** 保存一个 Axios 实例，方便用户验证 */
class AxiosClient {
  client = ky.create({});

  changeClient(newInst: KyInstance) {
    this.client = newInst;
  }

  private async validate(): Promise<false | IUserMe> {
    const token = localStorage.getItem('authToken');
    if (!token) return Promise.resolve(false);
    const newClient = ky.create({ headers: { Authorization: `Bearer ${token}` } });
    const res = await newClient.get('/api/user/me', { throwHttpErrors: false });
    if (res.status >= 500) throw new Error('服务器错误');
    if (res.status !== 200) {
      localStorage.removeItem('authToken');
      return Promise.resolve(false);
    }
    this.client = newClient;
    return res.json();
  }

  async login(password?: string, stuNum?: string) {
    if (password && stuNum) {
      const res = await ky.post('/api/auth/login', {
        throwHttpErrors: false,
        json: { password, stuNum },
      });
      if (res.status >= 300) {
        return false;
      }
      localStorage.setItem('authToken', (await res.json<{ token: string }>()).token);
    }
    return this.validate();
  }
}

const axiosClient = new AxiosClient();

export default axiosClient;
