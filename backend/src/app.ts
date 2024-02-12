import cors from 'cors';
import express from 'express';
import path from 'path';
import NumberModel from './models/NumberModel.js';
import apiRouter from './router/apiRouter.js';
import route from './utils/route.js';

const app = express();
app.use(cors());
app.use('/api', apiRouter);
app.use(express.static(route.staticRoute));
app.get('*', (req, res) => {
  res.sendFile(path.join(route.staticRoute, 'index.html'));
});

/** 初始化书本编号 */
NumberModel.findById('1').then((res) => {
  if (!res) {
    const num = new NumberModel({ _id: '1' });
    num.save();
  }
});

export default app;
