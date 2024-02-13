import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../drizzle/schema.js';
import route from './route.js';

const sqlite = new Database(route.dbRoute);
const db = drizzle(sqlite, { schema });

export default db;
