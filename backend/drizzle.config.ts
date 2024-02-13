/* eslint-disable-next-line import/no-extraneous-dependencies */
import { defineConfig } from 'drizzle-kit';
import path from 'node:path';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle',
  driver: 'better-sqlite',
  verbose: true,
  strict: true,
  dbCredentials: { url: path.resolve(__dirname || import.meta.dirname, '../db.sqlite') },
});
