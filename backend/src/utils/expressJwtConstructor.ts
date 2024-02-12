import { IsRevoked, Params } from 'express-jwt';
import { jwtSecret } from '../config';
import UserModel from '../models/UserModel';
import logger from './logger';

const tokenChecker: IsRevoked = async (_req: any, jwt) => {
  if (!jwt?.payload) return Promise.reject(true);
  const { payload } = jwt;
  if (typeof payload === 'string') return Promise.reject(true);
  const userInDB = await UserModel.findById(payload.id);
  if (userInDB === null || !payload.iat || payload.iat < Number(userInDB.lastRevokeTime)) {
    logger.error(payload.id);
    return Promise.reject(true);
  }
  return Promise.resolve(false);
};

const expressjwtOptions: Params = {
  secret: jwtSecret,
  algorithms: ['HS256'],
  isRevoked: tokenChecker,
};

export default expressjwtOptions;
