import IFrontendUser from './IFrontendUser';

export default interface IUserMe extends IFrontendUser {
  stuNum: string;
  collage: string;
  class: string;
  status: 0 | 1;
}
