import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import errorHandler from '../middlewares/errorHandler';
import requestLogger from '../middlewares/requestLogger';
import apiSpec from '../spec/apiSpec';
import userRouter from './userRouter';

require('express-async-errors');

const apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(requestLogger);
apiRouter.use(
  OpenApiValidator.middleware({ apiSpec, validateResponses: false, validateApiSpec: true }),
);
apiRouter.use('/user', userRouter);
apiRouter.get('/', async (req, res) => {
  res.json({ message: 'Hello, BookExchange here, what do you want to do?' });
});

apiRouter.use(errorHandler);

export default apiRouter;
