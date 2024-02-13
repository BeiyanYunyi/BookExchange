import dotenv from 'dotenv';

dotenv.config();

export const saltRounds = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10;
export const jwtSecret = process.env.JWT_SECRETS!; // Must be set
export const mongoUrl = process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/bookExchange';

if (!jwtSecret) throw new Error('JWT_SECRET not found');
