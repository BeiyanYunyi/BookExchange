/* eslint-disable no-underscore-dangle */
import express from 'express';
import bcrypt from 'bcryptjs';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import expressJwt, { UnauthorizedError } from 'express-jwt';
import { jwtSecret, saltRounds } from '../config';
import UserModel, { UserRoleEnum } from '../models/UserModel';
import expressjwtOptions from '../utils/expressJwtConstructor';
import ConflictError from '../errors/ConflictError';
import NotFoundError from '../errors/NotFoundError';
import BookModel from '../models/BookModel';

require('express-async-errors');

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  const { body } = req as {
    body: { name: string; password: string; stuNum: string; collage: string; class: string };
  };
  const count = await UserModel.count();
  const exist = await UserModel.findOne({ stuNum: body.stuNum });
  if (exist) throw new ConflictError('student number conflicted');
  const password = await bcrypt.hash(body.password, saltRounds);
  const user = new UserModel({
    name: body.name,
    password,
    // 第一个注册的用户是管理员
    role: count ? UserRoleEnum.default : UserRoleEnum.admin,
    stuNum: body.stuNum,
    collage: body.collage,
    class: body.class,
    lastRevokeTime: Date.now(),
  });
  await user.save();
  const resBody = user.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  const id = resBody._id;
  const token = jwt.sign({ id, iat: Date.now() }, jwtSecret);
  const info = lodash.pick(resBody, ['name', 'role', 'stuNum', 'collage', 'class', 'avatar']);
  res.json({ info: { ...info, id }, token });
});

userRouter.use(expressJwt(expressjwtOptions));

userRouter.get('/', async (req, res) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new NotFoundError('User Not Found');
  if (user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: "You can't do this!." });
  const users = await Promise.all(
    (
      await UserModel.find()
    ).map(async (aUser) => {
      const userJSON = aUser.toJSON();
      const [orderedBooks, committedBooks] = await Promise.all([
        BookModel.count({ orderBy: aUser._id }),
        BookModel.count({ owner: aUser._id, status: { $gte: 1 } }),
      ]);
      return {
        ...lodash.omit(userJSON, ['password', 'lastRevokeTime', '_id', '__v']),
        id: userJSON._id,
        orderedBooks,
        committedBooks,
      };
    }),
  );
  res.json(users);
});

userRouter.patch('/:userID', async (req, res) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new NotFoundError('User Not Found');
  if (user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: "You can't do this!." });
  await UserModel.findByIdAndUpdate(req.params.userID, { role: 1 }, { new: true });
  res.status(200).send();
});

userRouter.get('/me', async (req, res) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new NotFoundError('User Not Found');
  const resBody = user.toJSON();
  const [orderedBooks, committedBooks] = await Promise.all([
    BookModel.count({ orderBy: user.id }),
    BookModel.count({ owner: user.id, status: { $gte: 1 } }),
  ]);
  // eslint-disable-next-line no-underscore-dangle
  const id = resBody._id;
  const info = lodash.pick(resBody, ['name', 'role', 'stuNum', 'collage', 'class', 'avatar']);
  res.json({ ...info, id, orderedBooks, committedBooks });
});

userRouter.get('/balance', async (req, res) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new NotFoundError('User Not Found');
  const [orderedBooks, committedBooks] = await Promise.all([
    BookModel.count({ orderBy: user.id }),
    BookModel.count({ owner: user.id, status: { $gte: 1 } }),
  ]);
  res.json({ orderedBooks, committedBooks });
});

export default userRouter;
