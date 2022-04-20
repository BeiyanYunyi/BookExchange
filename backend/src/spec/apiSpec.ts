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
                  password: { $ref: '#/components/schemas/password' },
                  stuNum: { $ref: '#/components/schemas/stuNum' },
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
    '/api/user/balance': { get: { responses: { '200': { description: 'OK' } } } },
    '/api/auth/login': {
      post: {
        summary: 'Login',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: false,
                required: ['stuNum', 'password'],
                properties: {
                  stuNum: { $ref: '#/components/schemas/stuNum' },
                  password: { $ref: '#/components/schemas/password' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/auth/logout': {
      get: {
        summary: 'Logout',
        security: [{ auth: ['auth'] }],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/book': {
      post: {
        summary: 'Submit a book',
        security: [{ auth: ['auth'] }],
        responses: { '200': { description: 'OK' } },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'desc', 'author', 'tags', 'img'],
                properties: {
                  title: { type: 'string' },
                  desc: { type: 'string' },
                  author: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' }, maxItems: 5 },
                  img: { type: 'string' },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Get all books',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/book/{bookID}': {
      parameters: [
        {
          description: 'The ID of book',
          name: 'bookID',
          in: 'path',
          required: true,
          schema: { type: 'string', maxLength: 32, minLength: 20 },
        },
      ],
      put: {
        security: [{ auth: ['auth'] }],
        responses: { '200': { description: 'OK' } },
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
      },
      patch: {
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
      password: { type: 'string', nullable: false, minLength: 6, maxLength: 32 },
      stuNum: { type: 'string', nullable: false, minLength: 8, maxLength: 16 },
    },
    securitySchemes: { auth: { type: 'apiKey', in: 'header', name: 'Authorization' } },
  },
};

export default apiSpec;
