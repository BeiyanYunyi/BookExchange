import dotenv from 'dotenv';
import crypto from 'node:crypto';

dotenv.config();

export const saltRounds = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10;
export const jwtSecret =
  process.env.MODE === 'test' ? crypto.randomUUID() : process.env.JWT_SECRETS!; // Must be set

if (!jwtSecret) throw new Error('JWT_SECRET not found');
