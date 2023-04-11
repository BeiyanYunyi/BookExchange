import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import logger from './utils/logger';

// read username, password, address and port from environment variables
const mongoUser = process.env.MONGO_USER ;
const mongoPassword = process.env.MONGO_PASSWORD ;
const prefix = mongoUser && mongoPassword ? `${mongoUser}:${mongoPassword}@` : '';
const mongoAddress = process.env.MONGO_ADDRESS ?? "localhost";
const mongoPort = process.env.MONGO_PORT ?? "27017";

const mongoUrl = `mongodb://${prefix}${mongoAddress}:${mongoPort}/bookExchange`;

mongoose.connect(mongoUrl).then(() => {
  const server = http.createServer(app);
  server.listen(3001, () => {
    logger.info('BookExchange server started at 3001');
  });
});
