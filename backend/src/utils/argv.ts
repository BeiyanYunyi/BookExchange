import minimist from 'minimist';

interface Args {
  dev?: boolean;
  test?: boolean;
}

export default {
  ...minimist(process.argv, {
    boolean: ['dev', 'test'],
    alias: { d: 'dev', t: 'test' },
  }),
  test: process.env.NODE_ENV === 'test',
} as Args;
