import { eq } from 'drizzle-orm';
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js';
import { userModel } from '../drizzle/schema.js';
import NotFoundError from '../errors/NotFoundError.js';
import db from '../utils/db.js';
import expressjwtOptions from '../utils/expressJwtConstructor.js';

const authRouter = express.Router();

await import('express-async-errors');

authRouter.post('/login', async (req, res) => {
  const { body } = req as { body: { stuNum: string; password: string } };
  const stu = await db.query.userModel.findFirst({
    where: eq(userModel.stuNum, body.stuNum),
  });
  if (!stu) throw new NotFoundError('Student Number Not Found');
  const token = jwt.sign({ id: stu.id, iat: Date.now() }, jwtSecret);
  res.json({ token });
});

authRouter.use(expressjwt(expressjwtOptions));

authRouter.get('/logout', async (req, res) => {
  const stu = await db.query.userModel.findFirst({
    where: eq(userModel.id, req.auth!.id),
  });
  if (!stu) throw new NotFoundError('Student Not Found');
  await db.update(userModel).set({ lastRevokeTime: Date.now() });
  res.status(200).send();
});

export default authRouter;
