import bookResolvers from './bookResolvers.js';
import userResolvers from './userResolvers.js';

const queryResolvers = { ...userResolvers, ...bookResolvers };

export default queryResolvers;
