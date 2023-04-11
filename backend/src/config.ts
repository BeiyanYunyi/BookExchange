import dotenv from 'dotenv';

dotenv.config();

export const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
export const jwtSecret = process.env.JWT_SECRETS!; // Must be set
export const mongoUser = process.env.MONGO_USER; // Can be empty
export const mongoPassword = process.env.MONGO_PASSWORD; // Can be empty
export const mongoAddress = process.env.MONGO_ADDRESS ?? '127.0.0.1';
export const mongoPort = process.env.MONGO_PORT ?? '27017';

if (!jwtSecret) throw new Error('JWT_SECRET not found');
