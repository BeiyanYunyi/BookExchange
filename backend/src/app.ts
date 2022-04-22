import cors from 'cors';
import express from 'express';
import path from 'path';
import NumberModel from './models/NumberModel';
import apiRouter from './router/apiRouter';
import route from './utils/route';

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
