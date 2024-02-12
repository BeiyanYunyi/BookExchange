import { eq } from 'drizzle-orm';
import { userModel } from '../../drizzle/schema.js';
import db from '../../utils/db.js';

const userResolvers = {
  users: async () => {
    const users = await db.query.userModel.findMany({ with: { ordered: true, owned: true } });
    return users;
  },
  user: async (_parent: unknown, args: { id: string }) => {
    const user = await db.query.userModel.findFirst({
      where: eq(userModel.id, Number(args.id as string)),
      with: { ordered: true, owned: true },
    });
    return user;
  },
};

export default userResolvers;
