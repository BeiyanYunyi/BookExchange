/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import { count as dCount, eq } from 'drizzle-orm';
import express, { type Router } from 'express';
import { UnauthorizedError, expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';
import { jwtSecret, saltRounds } from '../config.js';
import { UserRoleEnum, userModel } from '../drizzle/schema.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';
import db from '../utils/db.js';
import expressjwtOptions from '../utils/expressJwtConstructor.js';

await import('express-async-errors');

const userRouter: Router = express.Router();

userRouter.post('/', async (req, res) => {
  const { body } = req as {
    body: { name: string; password: string; stuNum: string; college: string; class: string };
  };
  const exist = await db.query.userModel.findFirst({ where: eq(userModel.stuNum, body.stuNum) });
  if (exist) throw new ConflictError('student number conflicted');
  const { count } = (await db.select({ count: dCount() }).from(userModel))[0];
  const password = await bcrypt.hash(body.password, saltRounds);
  const user = await db
    .insert(userModel)
    .values({
      name: body.name,
      password,
      role: count ? UserRoleEnum.default : UserRoleEnum.admin,
      stuNum: body.stuNum,
      college: body.college,
      class: body.class,
      lastRevokeTime: Date.now(),
    })
    .returning();

  const resBody = user[0];
  // eslint-disable-next-line no-underscore-dangle
  const { id } = resBody;
  const token = jwt.sign({ id, iat: Date.now() }, jwtSecret);
  const info = lodash.pick(resBody, ['name', 'role', 'stuNum', 'college', 'class', 'avatar']);
  res.json({ info: { ...info, id }, token });
});

userRouter.use(expressjwt(expressjwtOptions));

userRouter.get('/', async (req, res) => {
  const user = await db.query.userModel.findFirst({
    where: eq(userModel.id, req.auth!.id),
  });
  if (!user) throw new NotFoundError('User Not Found');
  if (user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: "You can't do this!." });
  const users = await Promise.all(
    (await db.query.userModel.findMany({ with: { ordered: true, owned: true } })).map(
      async (aUser) => ({
        ...lodash.omit(aUser, ['password', 'lastRevokeTime']),
        orderedBooks: aUser.ordered.length,
        committedBooks: aUser.owned.length,
      }),
    ),
  );
  res.json(users);
});

userRouter.patch('/:userID', async (req, res) => {
  const user = await db.query.userModel.findFirst({
    where: eq(userModel.id, req.auth!.id),
  });
  if (!user) throw new NotFoundError('User Not Found');
  if (user.role !== 1)
    throw new UnauthorizedError('invalid_token', { message: "You can't do this!." });
  await db
    .update(userModel)
    .set({ role: UserRoleEnum.admin })
    .where(eq(userModel.id, Number(req.params.userID)));
  res.status(200).send();
});

userRouter.get('/me', async (req, res) => {
  const user = await db.query.userModel.findFirst({
    where: eq(userModel.id, req.auth!.id),
    with: { ordered: true, owned: true },
  });
  if (!user) throw new NotFoundError('User Not Found');
  // eslint-disable-next-line no-underscore-dangle
  const info = lodash.pick(user, ['name', 'role', 'stuNum', 'college', 'class', 'avatar', 'id']);
  res.json({ ...info, orderedBooks: user.ordered.length, committedBooks: user.owned.length });
});

userRouter.get('/balance', async (req, res) => {
  const user = await db.query.userModel.findFirst({
    where: eq(userModel.id, req.auth!.id),
    with: { ordered: true, owned: true },
  });
  if (!user) throw new NotFoundError('User Not Found');
  res.json({ orderedBooks: user.ordered.length, committedBooks: user.owned.length });
});

export default userRouter;
