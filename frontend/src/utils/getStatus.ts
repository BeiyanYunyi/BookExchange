import IFrontendBook from '../../../types/IFrontendBook';
import useAuthStore from '../stores/authState';

const getStatus = (book: IFrontendBook) => {
  const authState = useAuthStore();
  switch (book.status) {
    case 0:
      if (book.number !== 0) return '已确认';
      return '待确认';
    case 2:
      if (book.orderBy?.id === authState.user.id) return '被我预定';
      return '已被预定';
    case 3:
      return '已给出';
    case 4:
      return '已丢失';
    default:
      if (book.owner.id !== authState.user.id) return '可预定';
      return '等待预定';
  }
};

export default getStatus;
