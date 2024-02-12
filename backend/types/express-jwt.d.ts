declare namespace Express {
  export interface Auth {
    id: string;
    iat: number;
  }
  export interface Request {
    auth?: Auth;
  }
}

declare module 'express-async-errors';
