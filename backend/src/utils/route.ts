import path from 'path';

const root = path.resolve(import.meta.dirname, '../../../');

/** defined some route */
const route = {
  root,
  logRoute: path.join(root, 'log'),
  staticRoute: path.join(root, './backend/static'),
  dbRoute: path.join(root, 'db.sqlite'),
};

export default route;
