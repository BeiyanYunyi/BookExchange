import { GraphQLScalarType, Kind } from 'graphql';
import { BookStatusEnum, UserRoleEnum } from '../drizzle/schema.js';
import mutationResolvers from './mutations/index.js';
import queryResolvers from './queries/index.js';

const dateScalar = new GraphQLScalarType({
  name: 'Date',

  description: 'Date custom scalar type',

  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    if (typeof value === 'number') return value;

    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },

  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }

    throw new Error('GraphQL Date Scalar parser expected a `number`');
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date

      return new Date(parseInt(ast.value, 10));
    }

    // Invalid hard-coded value (not an integer)

    return null;
  },
});

const resolvers = {
  Date: dateScalar,
  UserRole: {
    ADMIN: UserRoleEnum.admin,
    DEFAULT: UserRoleEnum.default,
  },
  BookStatus: {
    PENDING: BookStatusEnum.pending,
    AVALIABLE: BookStatusEnum.avaliable,
    ORDERED: BookStatusEnum.ordered,
    BORROWED: BookStatusEnum.borrowed,
    LOST: BookStatusEnum.lost,
  },
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

export default resolvers;
