import { eq } from 'drizzle-orm';
import type { IsRevoked, Params } from 'express-jwt';
import { jwtSecret } from '../config.js';
import { userModel } from '../drizzle/schema.js';
import db from './db.js';
import logger from './logger.js';

const tokenChecker: IsRevoked = async (_req: any, jwt) => {
  if (!jwt?.payload) return true;
  const { payload } = jwt;
  if (typeof payload === 'string') return true;
  const userInDB = await db.query.userModel.findFirst({ where: eq(userModel.id, payload.id) });
  if (!userInDB || !payload.iat || payload.iat < userInDB.lastRevokeTime) {
    logger.error(payload.id);
    return true;
  }
  return Promise.resolve(false);
};

const expressjwtOptions: Params = {
  secret: jwtSecret,
  algorithms: ['HS256'],
  isRevoked: tokenChecker,
};

export default expressjwtOptions;
