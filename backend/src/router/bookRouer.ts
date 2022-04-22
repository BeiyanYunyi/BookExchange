/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import expressJwt, { UnauthorizedError } from 'express-jwt';
import lodash from 'lodash';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';
import NotFoundError from '../errors/NotFoundError';
import BookModel, { Book } from '../models/BookModel';
import UserModel, { User } from '../models/UserModel';
import expressJwtOptions from '../utils/expressJwtConstructor';
import userParser from '../utils/userParser';
import logger from '../utils/logger';
import NumberModel from '../models/NumberModel';

require('express-async-errors');

const bookRouter = express.Router();

bookRouter.get('/', async (req, res) => {
  let reqUser: User | null = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const user = jwt.decode(req.headers.authorization.replace('Bearer ', '')) as Express.User;
      const userInDB = await UserModel.findById(user.id);
      if (userInDB !== null && user.iat >= Number(userInDB.lastRevokeTime)) {
        reqUser = userInDB;
      }
    } catch (e) {
      logger.error(e);
    }
  }
  const books = (await BookModel.find().populate('owner').populate('orderBy')).map((book) => {
    const bookToReturn = lodash.pick(book.toJSON(), [
      'title',
      'desc',
      'author',
      'tags',
      'img',
      'status',
      'number',
    ]);
    return {
      ...bookToReturn,
      id: book._id,
      owner: userParser(book.owner),
      orderBy: userParser(
        reqUser?.role === 1 ||
          (book.orderBy && reqUser?._id.toString() === (book.orderBy as User)._id.toString())
          ? book.orderBy
          : undefined,
      ),
    };
  });
  res.json(books);
});

bookRouter.use(expressJwt(expressJwtOptions));

bookRouter.post('/', async (req, res) => {
  const { id } = req.user!;
  const user = await UserModel.findById(id);
  if (!user)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  const {
    body,
  }: { body: { title: string; desc: string; author: string; tags: string[]; img: string } } = req;
  const book = new BookModel({
    ...body,
    status: 0,
    owner: user,
    tags: Array.from(new Set(body.tags)),
  });
  await book.save();
  const bookToReturn = lodash.pick(book.toJSON(), [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
  ]);
  res.json({
    ...bookToReturn,
    owner: userParser(book.owner),
  });
});

/** 预定 / 取消预定 */
bookRouter.patch('/:bookID', async (req, res) => {
  const { id } = req.user!;
  const [user, book] = await Promise.all([
    UserModel.findById(id),
    BookModel.findById(req.params.bookID),
  ]);
  if (!user)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (!book) throw new NotFoundError('[404] Book not found');
  // 书本既不可预定又不已预定，或预定者是捐赠者本人
  if ((book.status !== 1 && book.status !== 2) || book.owner!.toString() === id)
    throw new BadRequestError('[400] You cannot order that!');
  // 书本已预定，且预定者不是本人
  if (book.status === 2 && book.orderBy!.toString() !== id)
    throw new ConflictError('[409] The book was ordered.');
  if (book.status === 1) {
    const [orderedBooks, committedBooks] = await Promise.all([
      BookModel.count({ orderBy: id }),
      BookModel.count({ owner: id, status: { $gte: 1 } }),
    ]);
    if (orderedBooks >= committedBooks)
      throw new BadRequestError('[400] You have ordered the max amount of books');
    book.orderBy = user;
    book.status = 2;
  } else {
    book.orderBy = undefined;
    book.status = 1;
  }
  await book.save();
  const savedBook = (await BookModel.findById(req.params.bookID)
    .populate('owner')
    .populate('orderBy'))!;
  const bookToReturn = lodash.pick(savedBook.toJSON(), [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
  ]);
  res.json({
    ...bookToReturn,
    id: savedBook._id,
    owner: userParser(savedBook!.owner),
    orderBy: userParser(savedBook!.orderBy),
  });
});

bookRouter.put('/:bookID', async (req, res) => {
  const { id } = req.user!;
  const [user, book] = await Promise.all([
    UserModel.findById(id),
    BookModel.findById(req.params.bookID),
  ]);
  if (!user || user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (!book) throw new NotFoundError('[404] Book not found');
  const { body } = req as { body: Partial<Book> };
  let updatedBook;
  if (body.orderBy === null) {
    const parsedBody = lodash.omit(body, 'orderBy');
    updatedBook = await BookModel.findByIdAndUpdate(req.params.bookID, parsedBody, { new: true })
      .populate('owner')
      .populate('orderBy');
    updatedBook!.orderBy = undefined;
    await updatedBook?.save();
  } else {
    updatedBook = await BookModel.findByIdAndUpdate(req.params.bookID, body, { new: true })
      .populate('owner')
      .populate('orderBy');
  }
  const bookToReturn = lodash.pick(updatedBook!.toJSON(), [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
  ]);
  res.json({
    ...bookToReturn,
    id: updatedBook!._id,
    owner: userParser(updatedBook!.owner),
    orderBy: userParser(updatedBook!.orderBy),
  });
});

bookRouter.get('/:bookID', async (req, res) => {
  const { id } = req.user!;
  const [user, book, latest] = await Promise.all([
    UserModel.findById(id),
    BookModel.findById(req.params.bookID).populate('owner').populate('orderBy'),
    NumberModel.findById('1'),
  ]);
  if (!user || user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (!book) throw new NotFoundError('[404] Book not found');
  book.number = latest!.latest + 1;
  latest!.latest += 1;
  await Promise.all([book.save(), latest!.save()]);
  const bookToReturn = lodash.pick(book.toJSON(), [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
  ]);
  res.json({
    ...bookToReturn,
    owner: userParser(book.owner),
    orderBy: userParser(book.orderBy),
  });
});

export default bookRouter;
