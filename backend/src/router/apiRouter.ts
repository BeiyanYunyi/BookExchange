import express from 'express';
import { middleware } from 'express-openapi-validator';
import errorHandler from '../middlewares/errorHandler.js';
import requestLogger from '../middlewares/requestLogger.js';
import authRouter from './authRouter.js';
import bookRouter from './bookRouter.js';
import userRouter from './userRouter.js';

await import('express-async-errors');

const apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(requestLogger);
apiRouter.use(
  middleware({
    apiSpec: './src/spec/apiSpec.json',
    validateResponses: false,
    validateApiSpec: true,
  }),
);
apiRouter.use('/user', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/book', bookRouter);
apiRouter.get('/', async (req, res) => {
  res.json({ message: 'Hello, BookExchange here, what do you want to do?' });
});

apiRouter.use(errorHandler);

export default apiRouter;
