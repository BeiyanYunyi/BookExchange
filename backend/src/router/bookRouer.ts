/* eslint-disable no-underscore-dangle */
import express from 'express';
import expressJwt, { UnauthorizedError } from 'express-jwt';
import lodash from 'lodash';
import BookModel from '../models/BookModel';
import UserModel, { User } from '../models/UserModel';
import expressJwtOptions from '../utils/expressJwtConstructor';

require('express-async-errors');

const bookRouter = express.Router();

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
  ]);
  res.json({
    ...bookToReturn,
    owner: {
      id: (book.owner as User)._id,
      name: (book.owner as User).name,
      avatar: (book.owner as User).avatar,
    },
  });
});

bookRouter.get('/', async (req, res) => {
  const books = (await BookModel.find().populate('owner')).map((book) => {
    const bookToReturn = lodash.pick(book.toJSON(), [
      'title',
      'desc',
      'author',
      'tags',
      'img',
      'status',
    ]);
    return {
      ...bookToReturn,
      owner: {
        id: (book.owner as User)._id,
        name: (book.owner as User).name,
        avatar: (book.owner as User).avatar,
      },
    };
  });
  res.json(books);
});

export default bookRouter;
