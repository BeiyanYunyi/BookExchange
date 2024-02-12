import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import express, { json } from 'express';
import { readFile } from 'fs/promises';
import { gql } from 'graphql-tag';
import path from 'node:path';
import NumberModel from './models/NumberModel.js';
import resolvers from './resolvers/index.js';
import apiRouter from './router/apiRouter.js';
import route from './utils/route.js';

const app = express();
app.use(cors());

const typeDefs = gql(
  await readFile(path.resolve(import.meta.dirname, '../../schema.graphql'), { encoding: 'utf-8' }),
);
const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers }) });
await server.start();

app.use('/api', apiRouter);
app.use('/gql', json(), expressMiddleware(server));
app.use(express.static(route.staticRoute));
app.get('*', (_req, res) => {
  res.sendFile(path.join(route.staticRoute, 'index.html'));
});

/** 初始化书本编号 */
NumberModel.findById('1').then((res) => {
  if (!res) {
    const num = new NumberModel({ _id: '1' });
    num.save();
  }
});

export default app;
