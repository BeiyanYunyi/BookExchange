import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const apiSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: { title: 'BookExchange', version: '0.0.1' },
  paths: {
    '/api/': { get: { responses: { '200': { description: 'OK' } } } },
    '/api/user': {
      post: {
        summary: 'Creates a user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: false,
                required: ['name', 'password', 'stuNum', 'collage', 'class'],
                properties: {
                  name: { type: 'string', nullable: false, minLength: 1, maxLength: 32 },
                  password: { type: 'string', nullable: false, minLength: 6, maxLength: 32 },
                  stuNum: { type: 'string', nullable: false, minLength: 8, maxLength: 16 },
                  collage: { type: 'string', nullable: false },
                  class: { type: 'string', nullable: false },
                },
              },
            },
          },
          required: true,
        },
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/user/me': {
      get: {
        summary: 'Get Me',
        security: [{ auth: ['auth'] }],
        responses: { '200': { description: 'OK' } },
      },
    },
  },
  components: {
    schemas: {
      uuid: {
        type: 'string',
        description: 'A UUID.',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$',
      },
    },
    securitySchemes: { auth: { type: 'apiKey', in: 'header', name: 'Authorization' } },
  },
};

export default apiSpec;
