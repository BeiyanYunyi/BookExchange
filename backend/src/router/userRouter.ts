import express from 'express';
import bcrypt from 'bcryptjs';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from '../../config/config.json';
import UserModel, { UserRoleEnum } from '../models/UserModel';
import expressjwtOptions from '../utils/expressJwtConstructor';
import ConflictError from '../errors/ConflictError';
import NotFoundError from '../errors/NotFoundError';

require('express-async-errors');

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  const { body } = req as {
    body: { name: string; password: string; stuNum: string; collage: string; class: string };
  };
  const exist = await UserModel.find({ stuNum: body.stuNum });
  if (exist) throw new ConflictError('student number conflicted');
  const password = await bcrypt.hash(body.password, config.saltRounds);
  const user = new UserModel({
    name: body.name,
    password,
    status: UserRoleEnum.default,
    stuNum: body.stuNum,
    collage: body.collage,
    class: body.class,
    lastRevokeTime: Date.now(),
  });
  await user.save();
  const resBody = user.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  const id = resBody._id;
  const token = jwt.sign({ id, iat: Date.now() }, config.jwtSecret);
  const info = lodash.pick(resBody, ['name', 'status', 'stuNum', 'collage', 'class', 'avatar']);
  res.json({ info: { ...info, id }, token });
});

userRouter.use(expressJwt(expressjwtOptions));

userRouter.get('/me', async (req, res) => {
  const usr = await UserModel.findById(req.user!.id);
  if (!usr) throw new NotFoundError('User Not Found');
  const resBody = usr.toJSON();
  const info = lodash.pick(resBody, ['name', 'status', 'stuNum', 'collage', 'class']);
  res.json(info);
});

export default userRouter;
