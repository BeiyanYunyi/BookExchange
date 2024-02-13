import cors from 'cors';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import express, { type Express } from 'express';
import path from 'node:path';
import apiRouter from './router/apiRouter.js';
import db from './utils/db.js';
import route from './utils/route.js';

const app: Express = express();
app.use(cors());

// const typeDefs = gql(
//   await readFile(path.resolve(import.meta.dirname, '../../schema.graphql'), { encoding: 'utf-8' }),
// );
// const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers }) });
// await server.start();

app.use('/api', apiRouter);
// app.use('/gql', json(), expressMiddleware(server, { context: ({ req }) => {} }));
app.use(express.static(route.staticRoute));
app.get('*', (_req, res) => {
  res.sendFile(path.join(route.staticRoute, 'index.html'));
});

migrate(db, { migrationsFolder: route.migrationRoute });

export default app;
