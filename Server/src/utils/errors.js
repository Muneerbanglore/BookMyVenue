const HttpStatusCodes = require('../constants/httpStatusCodes');
const ErrorCodes = require('../constants/errorCodes');

/**
 * Base Application Error class for custom operational exceptions.
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    this.errorCode = errorCode || ErrorCodes.INTERNAL_SERVER_ERROR;
    this.details = details;
    this.isOperational = true; // Distinguishes planned operational errors from developer bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errorCode = ErrorCodes.BAD_REQUEST, details = null) {
    super(message, HttpStatusCodes.BAD_REQUEST, errorCode, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', errorCode = ErrorCodes.AUTH_UNAUTHORIZED) {
    super(message, HttpStatusCodes.UNAUTHORIZED, errorCode);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', errorCode = ErrorCodes.AUTH_FORBIDDEN) {
    super(message, HttpStatusCodes.FORBIDDEN, errorCode);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errorCode = ErrorCodes.RESOURCE_NOT_FOUND) {
    super(message, HttpStatusCodes.NOT_FOUND, errorCode);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict resource state', errorCode = ErrorCodes.AUTH_USER_EXISTS) {
    super(message, HttpStatusCodes.CONFLICT, errorCode);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
