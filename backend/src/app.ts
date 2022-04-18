import cors from 'cors';
import express from 'express';
import apiRouter from './router/apiRouter';
import route from './utils/route';

const app = express();
app.use(cors());
app.use('/api', apiRouter);
app.use('/', express.static(route.staticRoute));

export default app;
