import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config.js';
import { userModel } from '../../drizzle/schema.js';
import NotFoundError from '../../errors/NotFoundError.js';
import db from '../../utils/db.js';

const userMutations = {
  login: async (_root: unknown, args: { info: { stuNum: string; password: string } }) => {
    const stu = await db.query.userModel.findFirst({
      where: eq(userModel.stuNum, args.info.stuNum),
      with: { ordered: true, owned: true },
    });
    const valid = await bcrypt.compare(args.info.password, stu?.password || '');
    if (!stu || !valid) throw new NotFoundError('Student number does not match with password');
    const token = jwt.sign({ id: stu.id, iat: Date.now() }, jwtSecret);
    return { user: stu, token };
  },
};

export default userMutations;
