import { UnauthorizedError } from 'express-jwt';
import { jwtSecret } from '../config';
import UserModel from '../models/UserModel';
import logger from './logger';

const tokenChecker = async (
  _req: any,
  payload: { username: string; id: string; iat: number },
  done: any,
) => {
  const userInDB = await UserModel.findById(payload.id);
  if (userInDB === null || payload.iat < Number(userInDB.lastRevokeTime)) {
    logger.error(payload.id);
    return done(
      new UnauthorizedError('revoked_token', {
        message: `[401] Unauthorized. Invalid token.`,
      }),
      true,
    );
  }
  return done(null, false);
};

const expressjwtOptions = {
  secret: jwtSecret,
  algorithms: ['HS256'],
  isRevoked: tokenChecker,
};

export default expressjwtOptions;
