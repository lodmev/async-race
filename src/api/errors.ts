/* eslint-disable max-classes-per-file */
export class WrongResponse extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'WrongResponse';
  }
}

export class ServerError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ServerError';
  }
}

export const httpStatus = {
  notFound: 404,
  toManyRequests: 429,
  internalServerError: 500,
};
