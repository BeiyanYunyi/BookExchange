import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import logger from './utils/logger';

mongoose.connect('mongodb://localhost:27017/bookExchange').then(() => {
  const server = http.createServer(app);
  server.listen(3001, () => {
    logger.info('BookExchange server started at 3001');
  });
});
