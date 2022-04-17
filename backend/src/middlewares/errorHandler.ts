import { Response, Request } from 'express';
import logger from '../utils/logger';

const errorHandler = (
  error: any,
  req: Request,
  res: Response<Record<string, any> | string>,
  next: () => unknown,
) => {
  const resToSend = res.header({ 'Content-Type': 'text/plain; charset=utf-8' });
  const isError = error instanceof Error;
  if (!isError) return next();
  logger.error(error.stack || error.message);

  switch (error.name) {
    case 'TypeError':
      return resToSend.status(400).send(error.message).end();
    case 'NotAllowedToSignUpError':
      return resToSend.status(401).send(error.message).end();
    case 'AnonymousNotAllowedError':
      return resToSend.status(401).send(error.message).end();
    case 'ConflictError':
      return resToSend.status(409).send(error.message).end();
    case 'NotFoundError':
      return resToSend.status(404).send(error.message).end();
    case 'BadRequestError':
      return resToSend.status(400).send(error.message).end();
    case 'Bad Request':
      return resToSend.status(400).send(error.message).end();
    case 'Method Not Allowed':
      return resToSend.status(405).send(error.message).end();
    case 'Not Found':
      return resToSend.status(404).send(error.message).end();
    case 'Unauthorized':
      return resToSend.status(401).send(error.message).end();
    default:
      break;
  }

  return resToSend.status(500).send(error.message);
};

export default errorHandler;
