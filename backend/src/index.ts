import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { mongoUrl } from './config.js';
import logger from './utils/logger.js';

console.log(`Attempting to connect to url ${mongoUrl}`);

mongoose.connect(mongoUrl).then(() => {
  const server = http.createServer(app);
  server.listen(3001, () => {
    logger.info('BookExchange server started at 3001');
  });
});
