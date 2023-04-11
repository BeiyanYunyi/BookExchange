import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { mongoAddress, mongoPassword, mongoPort, mongoUser } from './config';
import logger from './utils/logger';

const prefix = mongoUser && mongoPassword ? `${mongoUser}:${mongoPassword}@` : '';
const mongoUrl = `mongodb://${prefix}${mongoAddress}:${mongoPort}/bookExchange`;

mongoose.connect(mongoUrl).then(() => {
  const server = http.createServer(app);
  server.listen(3001, () => {
    logger.info('BookExchange server started at 3001');
  });
});
