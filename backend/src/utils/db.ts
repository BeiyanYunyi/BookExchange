import Database from 'better-sqlite3';
import { DefaultLogger, type LogWriter } from 'drizzle-orm';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../drizzle/schema.js';
import logger from './logger.js';
import route from './route.js';

class MyLogWriter implements LogWriter {
  // eslint-disable-next-line class-methods-use-this
  write(message: string): void {
    logger.info(message);
  }
}

const dzLogger = new DefaultLogger({ writer: new MyLogWriter() });

const sqlite = new Database(route.dbRoute);
const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, { schema, logger: dzLogger });

export default db;
