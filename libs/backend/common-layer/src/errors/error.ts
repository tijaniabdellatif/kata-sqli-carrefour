export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error
 */

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: any) {
    super(message, 404, details);
  }
}


export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, 400, true, details);
  } 
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', details?: any) {
    super(message, 401, details);
  }
}


export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: any) {
    super(message, 403, details);
  }  
}
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details?: any) {
    super(message, 500, details);
  }
}
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: any) {
    super(message, 400, details);
  } 
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict error', details?: any) {
    super(message, 409, details);
  } 
}   


export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable', details?: any) {
    super(message, 503, details);
  }   
}

export class GatewayTimeoutError extends AppError {
  constructor(message = 'Gateway timeout', details?: any) {
    super(message, 504, details);
  } 
}
export class PayloadTooLargeError extends AppError {
  constructor(message = 'Payload too large', details?: any) {
    super(message, 413, details);
  } 
}
export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests', details?: any) {
    super(message, 429, details);
  }   
}

export class MethodNotAllowedError extends AppError {
  constructor(message = 'Method not allowed', details?: any) {
    super(message, 405, details);
  }
}
export class NotImplementedError extends AppError {
  constructor(message = 'Not implemented', details?: any) {
    super(message, 501, details);
  }   
}

export class ConflictResourceError extends AppError {
  constructor(message = 'Conflict resource', details?: any) {
    super(message, 409, details);
  } 
}

export class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable entity', details?: any) {
    super(message, 422, details);
  } 
}

export class PreconditionFailedError extends AppError {
  constructor(message = 'Precondition failed', details?: any) {
    super(message, 412, details);
  } 
}

export class RangeNotSatisfiableError extends AppError {
  constructor(message = 'Range not satisfiable', details?: any) {
    super(message, 416, details);
  } 
}

export class DatabaseError extends AppError {
  constructor(message = 'Database error', details?: any) {
    super(message, 500, details);
  } 
}

