import cors from 'cors';
import express from 'express';
import apiRouter from './router/apiRouter';

const app = express();
app.use(cors());
app.use('/api', apiRouter);

export default app;
