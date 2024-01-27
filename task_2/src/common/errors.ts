import { HttpStatusCode, HttpStatusCodeType } from "./types";

export class BaseError extends Error {
  public httpStatusCode: HttpStatusCodeType;
  constructor(httpStatusCode: HttpStatusCodeType, message: string) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }
}

export class HTTP400Error extends BaseError {
  constructor(message: string) {
    super(HttpStatusCode.BAD_REQUEST, message);
  }
}

export class HTTP403Error extends BaseError {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}

export class HTTP404Error extends BaseError {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}

export class HTTP500Error extends BaseError {
  constructor(message: string) {
    super(HttpStatusCode.INTERNAL_SERVER, message);
  }
}
