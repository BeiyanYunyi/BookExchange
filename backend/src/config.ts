import dotenv from 'dotenv';

dotenv.config();
export const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
export const jwtSecret = process.env.JWT_SECRETS!;
if (!jwtSecret) throw new Error('JWT_SECRET not found');
