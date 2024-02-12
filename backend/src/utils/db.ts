import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';
import * as schema from '../drizzle/schema.js';

const sqlite = new Database(path.resolve(import.meta.dirname, '../../../db.sqlite'));
const db = drizzle(sqlite, { schema });

export default db;
