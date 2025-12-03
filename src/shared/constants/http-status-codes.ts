/**
 * HTTP Status Codes
 * Centralized constants for HTTP response status codes used in API testing
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Type for HTTP status code values
 */
export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

/**
 * Commonly used status code arrays for validation
 */
export const SuccessStatusCodes = [HttpStatus.OK, HttpStatus.CREATED, HttpStatus.NO_CONTENT] as const;
export const ClientErrorStatusCodes = [HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND] as const;
export const ServerErrorStatusCodes = [HttpStatus.INTERNAL_SERVER_ERROR] as const;

