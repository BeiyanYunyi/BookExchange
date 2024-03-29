import IFrontendUser from './IFrontendUser';

export default interface IUserMe extends IFrontendUser {
  stuNum: string;
  name: string;
  college: string;
  class: string;
  role: 0 | 1;
  orderedBooks: number;
  committedBooks: number;
}
