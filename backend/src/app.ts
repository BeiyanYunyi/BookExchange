import cors from 'cors';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import express, { type Express } from 'express';
import path from 'node:path';
import apiRouter from './router/apiRouter.js';
import db from './utils/db.js';
import route from './utils/route.js';

const app: Express = express();
app.use(cors());

app.use('/api', apiRouter);
app.use(express.static(route.staticRoute));
app.get('*', (_req, res) => {
  res.sendFile(path.join(route.staticRoute, 'index.html'));
});

migrate(db, { migrationsFolder: route.migrationRoute });

export default app;
