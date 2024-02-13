import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import express from 'express';
import { readFile } from 'fs/promises';
import { gql } from 'graphql-tag';
import path from 'node:path';
import { numberModel } from './drizzle/schema.js';
import resolvers from './resolvers/index.js';
import apiRouter from './router/apiRouter.js';
import db from './utils/db.js';
import route from './utils/route.js';

const app = express();
app.use(cors());

const typeDefs = gql(
  await readFile(path.resolve(import.meta.dirname, '../../schema.graphql'), { encoding: 'utf-8' }),
);
const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers }) });
await server.start();

app.use('/api', apiRouter);
// app.use('/gql', json(), expressMiddleware(server, { context: ({ req }) => {} }));
app.use(express.static(route.staticRoute));
app.get('*', (_req, res) => {
  res.sendFile(path.join(route.staticRoute, 'index.html'));
});

/** 初始化书本编号 */
const book = await db.query.bookModel.findFirst();

if (!book) await db.insert(numberModel).values({ id: 1 });

export default app;
