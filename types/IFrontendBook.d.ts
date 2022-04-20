import IFrontendUser from './IFrontendUser';

export default interface IFrontendBook {
  id: string;
  title: string;
  desc: string;
  author: string;
  owner: IFrontendUser;
  orderBy?: IFrontendUser;
  tags: string[];
  img: string;
  status: 0 | 1 | 2 | 3 | 4;
}
