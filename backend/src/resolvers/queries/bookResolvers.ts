import db from '../../utils/db.js';

const bookResolvers = {
  books: async () => {
    const books = await db.query.bookModel.findMany({
      with: { orderBy: true, owner: true, booksToTags: { with: { tag: true } } },
    });
    return books;
  },
};

export default bookResolvers;
