import IFrontendUser from './IFrontendUser';

export default interface IFrontendBook {
  id: string;
  title: string;
  desc: string;
  author: string;
  owner: IFrontendUser;
  tags: string[];
  img: string | null;
}
