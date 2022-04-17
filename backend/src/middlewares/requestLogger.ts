import { Response, Request } from 'express';
import logger from '../utils/logger';

const requestLogger = (
  req: Request,
  res: Response<Record<string, any> | string>,
  next: () => unknown,
) => {
  const { method, url } = req;
  const time = Date.now();
  res.on('finish', () => {
    logger.http({
      message: `${url} - ${Date.now() - time}ms`,
      statusCode: res.statusCode,
      method,
    });
  });
  next();
};

export default requestLogger;
