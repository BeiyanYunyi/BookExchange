import cors from 'cors';
import express from 'express';
import path from 'path';
import apiRouter from './router/apiRouter';
import route from './utils/route';

const app = express();
app.use(cors());
app.use('/api', apiRouter);
app.use(express.static(route.staticRoute));
app.get('*', (req, res) => {
  res.sendFile(path.join(route.staticRoute, 'index.html'));
});

export default app;
