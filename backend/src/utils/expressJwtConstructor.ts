import { UnauthorizedError } from 'express-jwt';
import UserModel from '../models/UserModel';
import logger from './logger';
import config from '../../config/config.json';

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

const SECRET = config.jwtSecret;
const expressjwtOptions = {
  secret: SECRET,
  algorithms: ['HS256'],
  isRevoked: tokenChecker,
};

export default expressjwtOptions;
