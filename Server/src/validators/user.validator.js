const Joi = require('joi');

/**
 * Validator schema for profile update
 */
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Name cannot exceed 50 characters'
    }),
  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    })
}).min(1); // At least one field must be provided for update

module.exports = {
  updateProfileSchema,
};
