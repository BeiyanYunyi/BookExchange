import path from 'path';

const root = process.cwd();

/** defined some route */
const route = {
  root,
  logRoute: path.join(root, 'log'),
  staticRoute: path.join(root, 'static'),
};

export default route;
