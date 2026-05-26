const logger = require('../config/logger');
const HttpStatusCodes = require('../constants/httpStatusCodes');
const ErrorCodes = require('../constants/errorCodes');
const { AppError } = require('../utils/errors');

/**
 * Global Error handling middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let errorCode = err.errorCode || ErrorCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Handle Phase 1 Validation Errors
  if (err.errorCode === 'VALIDATION_FAILED' || errorCode === 'VALIDATION_FAILED') {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      error_type: 2,
      statusCode: 400,
      errorCode: 'VALIDATION_FAILED',
      message: err.message || 'The request payload contains invalid or missing data.',
      errors: err.details || [],
      timestamp: new Date().toISOString()
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = HttpStatusCodes.BAD_REQUEST;
    errorCode = ErrorCodes.VALIDATION_ERROR;
    message = 'Validation failure';
    details = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = HttpStatusCodes.CONFLICT;
    errorCode = ErrorCodes.AUTH_USER_EXISTS;
    const fieldName = Object.keys(err.keyValue)[0];
    message = `Resource already exists with this ${fieldName}`;
  }

  // Handle Mongoose invalid object ID (CastError)
  if (err.name === 'CastError') {
    statusCode = HttpStatusCodes.BAD_REQUEST;
    errorCode = ErrorCodes.BAD_REQUEST;
    message = `Invalid ID format for ${err.path}`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HttpStatusCodes.UNAUTHORIZED;
    errorCode = ErrorCodes.AUTH_INVALID_TOKEN;
    message = 'Invalid authentication token signature';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HttpStatusCodes.UNAUTHORIZED;
    errorCode = ErrorCodes.AUTH_TOKEN_EXPIRED;
    message = 'Authentication token expired';
  }

  // Log error based on level
  if (statusCode >= 500) {
    // Serious system exception
    logger.error(`${req.method} ${req.originalUrl} - Internal Server Error: ${err.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      body: req.body,
    });
  } else {
    // Client error (operational)
    logger.warn(`${req.method} ${req.originalUrl} - Bad Request: ${message}`, {
      code: errorCode,
      details,
    });
  }

  // Send uniform JSON response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details: details || undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

module.exports = errorHandler;
