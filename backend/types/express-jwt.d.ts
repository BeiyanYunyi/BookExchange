declare namespace Express {
  export interface Auth {
    id: number;
    iat: number;
  }
  export interface Request {
    auth?: Auth;
  }
}

declare module 'express-async-errors';
