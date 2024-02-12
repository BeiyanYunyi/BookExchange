import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  generates: {
    './backend/src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-document-nodes'],
    },
  },
};

export default config;
