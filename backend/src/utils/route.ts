import path from 'path';

const root = path.resolve(import.meta.dirname, '../../../');

/** defined some route */
const route = {
  root,
  logRoute: path.join(root, 'log'),
  staticRoute: path.join(root, './backend/static'),
  dbRoute: process.env.MODE === 'test' ? ':memory:' : path.join(root, 'db.sqlite'),
  migrationRoute: path.join(root, './backend/src/drizzle'),
};

export default route;
