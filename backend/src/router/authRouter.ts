import express from 'express';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
import NotFoundError from '../errors/NotFoundError.js';
import UserModel from '../models/UserModel.js';
import expressjwtOptions from '../utils/expressJwtConstructor.js';

const authRouter = express.Router();

await import('express-async-errors');

authRouter.post('/login', async (req, res) => {
  const { body } = req as { body: { stuNum: string; password: string } };
  const stu = await UserModel.findOne({ stuNum: body.stuNum });
  if (!stu) throw new NotFoundError('Student Number Not Found');
  const resBody = stu.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  const id = resBody._id;
  const token = jwt.sign({ id, iat: Date.now() }, jwtSecret);
  res.json({ token });
});

authRouter.use(expressjwt(expressjwtOptions));

authRouter.get('/logout', async (req, res) => {
  const stu = await UserModel.findById(req.auth!.id);
  if (!stu) throw new NotFoundError('Student Not Found');
  stu.lastRevokeTime = Date.now();
  await stu.save();
  res.status(200).send();
});

export default authRouter;
