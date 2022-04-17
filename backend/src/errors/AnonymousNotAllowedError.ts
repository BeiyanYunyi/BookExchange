export default class AnonymousNotAllowedError extends Error {
  message: string;

  name = 'AnonymousNotAllowedError';

  constructor(message: string) {
    super();
    this.message = message;
  }
}
