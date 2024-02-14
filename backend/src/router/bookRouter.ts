/* eslint-disable no-underscore-dangle */
import { and, count, eq, gt, gte, sql } from 'drizzle-orm';
import express, { type Router } from 'express';
import { UnauthorizedError, expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';
import {
  UserRoleEnum,
  bookModel,
  tagModel,
  tagsToBooksModel,
  userModel,
} from '../drizzle/schema.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';
import db from '../utils/db.js';
import expressJwtOptions from '../utils/expressJwtConstructor.js';
import logger from '../utils/logger.js';
import userParser from '../utils/userParser.js';

await import('express-async-errors');

const bookRouter: Router = express.Router();

bookRouter.get('/', async (req, res) => {
  let reqUser:
    | {
        id: number;
        name: string;
        password: string;
        avatar: string | null;
        role: number;
        stuNum: string;
        college: string | null;
        class: string | null;
        lastRevokeTime: number;
      }
    | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const user = jwt.decode(req.headers.authorization.replace('Bearer ', '')) as Express.Auth;
      const userInDB = await db.query.userModel.findFirst({ where: eq(userModel.id, user.id) });
      if (!!userInDB && user.iat >= Number(userInDB.lastRevokeTime)) {
        reqUser = userInDB;
      }
    } catch (e) {
      logger.error(e);
    }
  }
  const books = (
    await db.query.bookModel.findMany({
      columns: {
        title: true,
        desc: true,
        author: true,
        img: true,
        status: true,
        id: true,
        number: true,
      },
      with: { booksToTags: true, owner: true, orderBy: true },
    })
  ).map((book) => {
    const bookToReturn = lodash.pick(book, [
      'title',
      'desc',
      'author',
      'img',
      'status',
      'number',
      'id',
    ]);
    return {
      ...bookToReturn,
      owner: userParser(book.owner),
      orderBy: userParser(
        reqUser?.role === UserRoleEnum.admin ||
          (book.orderBy && reqUser && reqUser.id === book.orderBy.id)
          ? book.orderBy
          : null,
      ),
      tags: book.booksToTags.map((tag) => tag.tagName),
    };
  });
  res.json(books);
});

bookRouter.use(expressjwt(expressJwtOptions));

bookRouter.post('/ordering', async (req, res) => {
  const { id } = req.auth!;
  const user = await db.query.userModel.findFirst({ where: eq(userModel.id, id) });
  if (!user || user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  const result = await db
    .update(bookModel)
    .set({ status: 1 })
    .where(and(eq(bookModel.status, 0), gt(bookModel.number, 0)))
    .returning({ id: bookModel.id });
  res.json({ result, books: result.map((book) => book.id) });
});

bookRouter.delete('/ordering', async (req, res) => {
  const { id } = req.auth!;
  const user = await db.query.userModel.findFirst({ where: eq(userModel.id, id) });
  if (!user || user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  const result = await db
    .update(bookModel)
    .set({ status: 0 })
    .where(and(gte(bookModel.status, 1), gt(bookModel.number, 0)))
    .returning({ id: bookModel.id });
  res.json({ result, books: result.map((book) => book.id) });
});

bookRouter.post('/', async (req, res) => {
  const { id } = req.auth!;
  const user = await db.query.userModel.findFirst({ where: eq(userModel.id, id) });
  if (!user)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  const {
    body,
  }: { body: { title: string; desc: string; author: string; tags: string[]; img: string } } = req;
  const { tags, ...otherBody } = body;
  const hasTags = !!tags.length;
  if (hasTags) {
    await db
      .insert(tagModel)
      .values(body.tags.map((tag) => ({ name: tag })))
      .onConflictDoNothing();
  }
  const book = (
    await db
      .insert(bookModel)
      .values([{ ...otherBody, owner: user.id, status: 0 }])
      .returning()
  )[0];
  if (hasTags) {
    await db
      .insert(tagsToBooksModel)
      .values(Array.from(new Set(tags)).map((tag) => ({ tagName: tag, bookId: book.id })));
  }
  const bookToReturn = lodash.pick(book, [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
    'id',
  ]);
  res.status(201).json({
    ...bookToReturn,
    owner: userParser(user),
    tags: Array.from(new Set(tags)),
  });
});

/** 预定 / 取消预定 */
bookRouter.patch('/:bookID', async (req, res) => {
  const { id } = req.auth!;
  const [user, book] = await Promise.all([
    db.query.userModel.findFirst({ where: eq(userModel.id, id) }),
    db.query.bookModel.findFirst({ where: eq(bookModel.id, Number(req.params.bookID)) }),
  ]);
  if (!user)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (!book) throw new NotFoundError('[404] Book not found');
  // 书本既不可预定又不已预定，或预定者是捐赠者本人
  if ((book.status !== 1 && book.status !== 2) || book.owner === id)
    throw new BadRequestError('[400] You cannot order that!');
  // 书本已预定，且预定者不是本人
  if (book.status === 2 && book.orderBy !== id)
    throw new ConflictError('[409] The book was ordered.');
  if (book.status === 1) {
    const [orderedBooks, committedBooks] = await Promise.all([
      db
        .select({ value: count() })
        .from(bookModel)
        .where(eq(bookModel.orderBy, id))
        .then((resu) => resu[0].value),
      db
        .select({ value: count() })
        .from(bookModel)
        .where(and(eq(bookModel.owner, id), gte(bookModel.status, 1)))
        .then((resu) => resu[0].value),
    ]);
    if (orderedBooks >= committedBooks)
      throw new BadRequestError('[400] You have ordered the max amount of books');
    await db
      .update(bookModel)
      .set({ orderBy: user.id, status: 2 })
      .where(eq(bookModel.id, book.id));
  } else {
    await db.update(bookModel).set({ orderBy: null, status: 1 }).where(eq(bookModel.id, book.id));
  }
  const savedBook = (await db.query.bookModel.findFirst({
    where: eq(bookModel.id, book.id),
    with: { owner: true, orderBy: true },
  }))!;

  const bookToReturn = lodash.pick(savedBook, [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
    'id',
  ]);
  res.json({
    ...bookToReturn,
    owner: userParser(savedBook!.owner),
    orderBy: userParser(savedBook!.orderBy),
  });
});

bookRouter.put('/:bookID', async (req, res) => {
  const { id } = req.auth!;
  const [user, book] = await Promise.all([
    db.query.userModel.findFirst({ where: eq(userModel.id, id) }),
    db.query.bookModel.findFirst({ where: eq(bookModel.id, Number(req.params.bookID)) }),
  ]);
  if (!user || user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (!book) throw new NotFoundError('[404] Book not found');
  const { body } = req as {
    body: Partial<{
      number: number;
      id: number;
      title: string;
      desc: string;
      author: string;
      img: string | null;
      status: number;
      orderBy: number | null;
      owner: number;
    }>;
  };
  const uBook = (
    await db
      .update(bookModel)
      .set(body)
      .where(eq(bookModel.id, Number(req.params.bookID)))
      .returning({ id: bookModel.id })
  )[0];
  const updatedBook = await db.query.bookModel.findFirst({
    where: eq(bookModel.id, uBook.id),
    with: { owner: true, orderBy: true, booksToTags: true },
  });

  const bookToReturn = lodash.pick(updatedBook, [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
    'id',
  ]);
  res.json({
    ...bookToReturn,
    owner: userParser(updatedBook!.owner),
    orderBy: userParser(updatedBook!.orderBy),
    tags: updatedBook!.booksToTags.map((tag) => tag.tagName),
  });
});

bookRouter.get('/:bookID', async (req, res) => {
  const { id } = req.auth!;
  const [user, book] = await Promise.all([
    db.query.userModel.findFirst({ where: eq(userModel.id, id) }),
    db.query.bookModel.findFirst({
      where: eq(bookModel.id, Number(req.params.bookID)),
      with: { owner: true, orderBy: true },
    }),
  ]);
  if (!user || user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (!book) throw new NotFoundError('[404] Book not found');
  await db
    .update(bookModel)
    .set({ number: sql<number>`(select max("number") from "books") + 1` })
    .where(eq(bookModel.id, book.id));
  const nBook = await db.query.bookModel.findFirst({
    where: eq(bookModel.id, Number(req.params.bookID)),
    with: { owner: true, orderBy: true, booksToTags: true },
  });
  const bookToReturn = lodash.pick(nBook, [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
    'id',
  ]);
  res.json({
    ...bookToReturn,
    owner: userParser(book.owner),
    orderBy: userParser(book.orderBy),
    tags: nBook!.booksToTags.map((tag) => tag.tagName),
  });
});

bookRouter.get('/:bookID/receive', async (req, res) => {
  const { id } = req.auth!;
  const [user, book] = await Promise.all([
    db.query.userModel.findFirst({ where: eq(userModel.id, id) }),
    db.query.bookModel.findFirst({
      where: eq(bookModel.id, Number(req.params.bookID)),
      with: { owner: true, orderBy: true },
    }),
  ]);
  if (!book) throw new NotFoundError('[404] Book not found');
  if (!user || (book.orderBy?.id !== id && user.role !== 1))
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  await db.update(bookModel).set({ status: 3 }).where(eq(bookModel.id, book.id));
  const bookToReturn = lodash.pick(book, [
    'title',
    'desc',
    'author',
    'tags',
    'img',
    'status',
    'number',
    'id',
  ]);
  res.json({
    ...bookToReturn,
    status: 3,
    owner: userParser(book.owner),
    orderBy: userParser(book.orderBy),
  });
});

bookRouter.delete('/:bookID', async (req, res) => {
  const { id } = req.auth!;
  const [user, book] = await Promise.all([
    db.query.userModel.findFirst({ where: eq(userModel.id, id) }),
    db.query.bookModel.findFirst({
      where: eq(bookModel.id, Number(req.params.bookID)),
      with: { owner: true, orderBy: true },
    }),
  ]);
  if (!book) throw new NotFoundError('[404] Book not found');
  if (!user || (user.role !== 1 && book.owner.id !== id))
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  if (book.number !== 0 && user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: '[401] Unauthorized. Invalid token.' });
  await db.delete(bookModel).where(eq(bookModel.id, book.id));
  res.status(204).send();
});

export default bookRouter;
