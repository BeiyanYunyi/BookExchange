export default class BadRequestError extends Error {
  message: string;

  name = 'BadRequestError';

  constructor(message: string) {
    super();
    this.message = message;
  }
}
