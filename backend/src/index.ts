import http from 'http';
import mongoose from 'mongoose';
import app from './app';

mongoose.connect('mongodb://localhost:27017/bookExchange');
const server = http.createServer(app);
server.listen(3001);
