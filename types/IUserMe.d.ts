import IFrontendUser from './IFrontendUser';

export default interface IUserMe extends IFrontendUser {
  stuNum: string;
  collage: string;
  class: string;
  role: 0 | 1;
}
