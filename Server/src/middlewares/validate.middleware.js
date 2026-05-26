const { BadRequestError } = require('../utils/errors');
const ErrorCodes = require('../constants/errorCodes');

/**
 * Validation middleware factory that validates request payloads against Joi schemas
 * @param {Object} schema - Joi Schema to validate against
 * @param {string} source - Request object source to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown object keys
    });

    if (error) {
      const details = error.details.map((err) => ({
        field: err.path.join('.'),
        rejectedValue: err.context ? err.context.value : undefined,
        reason: err.message.replace(/['"]/g, ''),
      }));

      return next(
        new BadRequestError(
          'The request payload contains invalid or missing data.',
          'VALIDATION_FAILED',
          details
        )
      );
    }

    // Replace request payload with sanitized, validated values
    req[source] = value;
    next();
  };
};

module.exports = validate;
