import http from 'http';
import app from './app.js';
import logger from './utils/logger.js';

const server = http.createServer(app);
server.listen(3001, () => {
  logger.info('BookExchange server started at 3001');
});
